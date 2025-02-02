import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage, ChatRoom } from "@/types/chat";
import { toast } from "sonner";
import { format } from "date-fns";

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await dbService.init();

        if (!wsService.isConnected()) {
          await wsService.connect();
        }
        setIsConnected(true);

        if (roomId) {
          console.log("Fetching messages for room:", roomId);
          // Verify room exists in local DB
          const room = await dbService.getChatRoom(roomId);
          if (!room) {
            throw new Error("Chat room not found");
          }

          // Fetch messages via WebSocket
          await wsService.send({
            action: "getMessages",
            data: {
              chatRoomId: roomId,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              date: format(new Date(), 'yyyy-MM-dd'),
            },
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to load messages");
        setIsLoading(false);
      }
    };

    const handleNewMessage = async (data: ChatMessage) => {
      console.log("Received new message:", data);
      if (data.roomId === roomId) {
        // Save message to local DB first
        await dbService.saveMessage(data);
        
        // Get current user's phone from localStorage
        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          console.error("User phone not found in localStorage");
          return;
        }

        // Get chat room to determine if user is sender
        const room = await dbService.getChatRoom(data.roomId);
        if (!room) {
          console.error("Chat room not found for message:", data);
          return;
        }

        // Determine if current user is the sender
        const currentUserParticipant = room.participants.find(p => p.phone === userPhone);
        const isSender = currentUserParticipant?.id === data.senderId;

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

        setMessages(prev => [...prev, newMessage]);
      }
    };

    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      console.log("Received messages:", data);
      if (data.action === "getMessages" && data.messages) {
        // Save all messages to local DB first
        await dbService.saveMessages(data.messages);

        // Get current user's phone
        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          console.error("User phone not found in localStorage");
          return;
        }

        // Get chat room to determine message directions
        const room = await dbService.getChatRoom(roomId);
        if (!room) {
          console.error("Chat room not found");
          return;
        }

        const currentUserParticipant = room.participants.find(p => p.phone === userPhone);

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

        setMessages(prev => [...prev, ...newMessages]);
      }
    };

    const unsubscribeNew = wsService.subscribe("chat", "sendMessage", handleNewMessage);
    const unsubscribeReceived = wsService.subscribe("chat", "getMessages", handleReceivedMessages);

    if (roomId) {
      initializeChat();
    }

    return () => {
      unsubscribeNew();
      unsubscribeReceived();
    };
  }, [roomId]);

  const sendMessage = async (content: string, type: Message["type"] = "text") => {
    if (!roomId) {
      toast.error("Chat room not initialized");
      return;
    }

    try {
      const chatRoom = await dbService.getChatRoom(roomId);
      if (!chatRoom) throw new Error("Chat room not found");

      const userPhone = localStorage.getItem("userPhone");
      if (!userPhone) throw new Error("User not logged in");

      const recipient = chatRoom.participants.find(p => p.phone !== userPhone);
      if (!recipient) throw new Error("Recipient not found");

      await wsService.send({
        action: "sendMessage",
        data: {
          content,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId,
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
    isConnected,
  };
};