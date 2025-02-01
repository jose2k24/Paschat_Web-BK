import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage } from "@/types/chat";
import { toast } from "sonner";
import { format } from "date-fns";
import { apiService } from "@/services/api";

export const useChat = (contactId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await dbService.init();

        // Get contact details including roomId
        const contact = await dbService.getContact(contactId.toString());
        if (!contact) {
          throw new Error("Contact not found");
        }

        console.log("Found contact:", contact);

        // If contact has roomId, verify it exists in chat rooms
        if (contact.roomId) {
          const chatRoom = await dbService.getChatRoom(contact.roomId);
          if (chatRoom) {
            setRoomId(contact.roomId);
            console.log("Using existing room ID:", contact.roomId);
            
            // Fetch messages for the room from local DB
            const localMessages = await dbService.getMessagesByRoom(contact.roomId);
            if (localMessages.length > 0) {
              setMessages(localMessages);
            }
          } else {
            // Room doesn't exist, need to create new one
            contact.roomId = null;
          }
        }

        // Create new chat room if none exists
        if (!contact.roomId) {
          const userPhone = localStorage.getItem('userPhone');
          if (!userPhone) throw new Error("User phone not found");

          console.log("Creating new chat room between", userPhone, "and", contact.phone);
          
          const response = await apiService.createChatRoom(userPhone, contact.phone);
          
          if (response.data) {
            const newRoomId = response.data.roomId;
            
            // Save new chat room to local DB
            await dbService.saveChatRoom({
              roomId: newRoomId,
              roomType: 'private',
              createdAt: response.data.createdAt,
              participants: response.data.participants
            });
            
            // Update contact with new roomId
            await dbService.updateContactRoomId(contact.phone, newRoomId);
            setRoomId(newRoomId);
            console.log("Created new room ID:", newRoomId);
          }
        }

        // Connect to WebSocket and fetch today's messages
        if (!wsService.isConnected()) {
          await wsService.connect();
        }

        const today = format(new Date(), 'yyyy-MM-dd');
        
        if (roomId) {
          console.log("Fetching messages for room:", roomId);
          await wsService.send({
            action: "getMessages",
            data: {
              chatRoomId: roomId,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              date: today,
            },
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to load messages");
        toast.error("Failed to load messages");
        setIsLoading(false);
      }
    };

    if (contactId) {
      initializeChat();
    }

    // Handle new message event
    const handleNewMessage = async (data: ChatMessage) => {
      console.log("Received new message:", data);
      if (data.roomId === roomId) {
        const newMessage: Message = {
          id: data.id,
          content: data.content,
          sender_id: data.senderId,
          chat_id: data.roomId,
          type: data.type,
          is_edited: false,
          created_at: data.createdAt,
          read: data.read
        };
        
        await dbService.saveMessage(data);
        setMessages(prev => [...prev, newMessage]);
      }
    };

    // Handle received messages event
    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      console.log("Received messages:", data);
      if (data.action === "getMessages" && data.messages) {
        const newMessages = data.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.senderId,
          chat_id: msg.roomId,
          type: msg.type,
          is_edited: false,
          created_at: msg.createdAt,
          read: msg.read
        }));

        await dbService.saveMessages(data.messages);
        setMessages(prev => [...prev, ...newMessages]);
      }
    };

    const unsubscribeNew = wsService.subscribe("chat", "sendMessage", handleNewMessage);
    const unsubscribeReceived = wsService.subscribe("chat", "getMessages", handleReceivedMessages);

    return () => {
      unsubscribeNew();
      unsubscribeReceived();
    };
  }, [contactId, roomId]);

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    if (!roomId) {
      toast.error("Chat room not initialized");
      return;
    }

    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error("User not logged in");

      const chatRoom = await dbService.getChatRoom(roomId);
      if (!chatRoom) throw new Error("Chat room not found");

      // Find recipient ID from participants
      const recipient = chatRoom.participants.find(p => p.phone !== userPhone);
      if (!recipient) throw new Error("Recipient not found");

      await wsService.send({
        action: "sendMessage",
        data: {
          content,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId,
          mediaUrl,
          recipientId: recipient.id
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      throw error;
    }
  };

  const setTypingStatus = (isTyping: boolean) => {
    wsService.send({
      action: "setStatus",
      data: {
        status: isTyping ? "typing" : "online",
      },
    });
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setTypingStatus,
    roomId,
  };
};