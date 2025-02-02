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
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection and chat room
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await dbService.init();

        // Connect to WebSocket if not already connected
        if (!wsService.isConnected()) {
          await wsService.connect();
        }
        setIsConnected(true);

        // Get contact details including roomId
        const contact = await dbService.getContact(contactId.toString());
        if (!contact) {
          throw new Error("Contact not found");
        }

        console.log("Found contact:", contact);

        // Verify existing room or create new one
        let finalRoomId = contact.roomId;
        if (finalRoomId) {
          const chatRoom = await dbService.getChatRoom(finalRoomId);
          if (!chatRoom) {
            finalRoomId = null;
          }
        }

        // Create new chat room if needed
        if (!finalRoomId) {
          const userPhone = localStorage.getItem('userPhone');
          if (!userPhone) throw new Error("User phone not found");

          console.log("Creating new chat room between", userPhone, "and", contact.phone);
          
          const response = await apiService.createChatRoom(userPhone, contact.phone);
          
          if (response.data) {
            finalRoomId = response.data.roomId;
            
            await dbService.saveChatRoom({
              roomId: finalRoomId,
              roomType: 'private',
              createdAt: response.data.createdAt,
              participants: response.data.participants
            });
            
            await dbService.updateContactRoomId(contact.phone, finalRoomId);
          }
        }

        setRoomId(finalRoomId);

        // Fetch messages for the room
        if (finalRoomId) {
          console.log("Fetching messages for room:", finalRoomId);
          await wsService.send({
            action: "getMessages",
            data: {
              chatRoomId: finalRoomId,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              date: format(new Date(), 'yyyy-MM-dd'),
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

    // Handle WebSocket events
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
    if (isConnected) {
      wsService.send({
        action: "setStatus",
        data: {
          status: isTyping ? "typing" : "online",
        },
      });
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setTypingStatus,
    roomId,
    isConnected,
  };
};