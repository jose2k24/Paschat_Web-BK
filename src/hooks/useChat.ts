import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage } from "@/types/chat";
import { toast } from "sonner";
import { format } from "date-fns";

export const useChat = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await dbService.init();

        // Get contact details including roomId
        const contact = await dbService.getContact(contactId);
        if (!contact) {
          throw new Error("Contact not found");
        }

        // If contact has no roomId, create a new chat room
        if (!contact.roomId) {
          const userPhone = localStorage.getItem('userPhone');
          if (!userPhone) throw new Error("User phone not found");

          const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/room`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              user1Phone: userPhone,
              user2Phone: contact.phone
            })
          });

          if (!response.ok) throw new Error("Failed to create chat room");
          
          const data = await response.json();
          contact.roomId = data.roomId.toString();
          await dbService.updateContactRoomId(contact.phone, contact.roomId);
        }

        setRoomId(contact.roomId);

        // Fetch messages for the room
        const localMessages = await dbService.getMessagesByRoom(contact.roomId);
        if (localMessages.length > 0) {
          setMessages(localMessages);
        }

        // Connect to WebSocket and fetch today's messages
        wsService.connect();
        const today = format(new Date(), 'yyyy-MM-dd');
        
        await wsService.send({
          action: "getMessages",
          data: {
            chatRoomId: contact.roomId,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            date: today,
          },
        });

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
      if (data.roomId.toString() === roomId) {
        const newMessage: Message = {
          id: data.id.toString(),
          content: data.content,
          sender_id: data.senderId.toString(),
          chat_id: data.roomId.toString(),
          type: data.type,
          is_edited: false,
          created_at: data.createdAt,
        };
        setMessages(prev => [...prev, newMessage]);
        await dbService.saveMessage(data);
      }
    };

    // Handle received messages event
    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      if (data.action === "getMessages" && data.messages) {
        const newMessages = data.messages.map(msg => ({
          id: msg.id.toString(),
          content: msg.content,
          sender_id: msg.senderId.toString(),
          chat_id: msg.roomId.toString(),
          type: msg.type,
          is_edited: false,
          created_at: msg.createdAt,
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
      await wsService.send({
        action: "sendMessage",
        data: {
          content,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId: parseInt(roomId),
          mediaUrl,
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