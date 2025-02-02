import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage, transformChatMessage } from "@/types/chat";
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

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No auth token found");
        }

        if (!wsService.isConnected()) {
          console.log("Initializing WebSocket connection...");
          await wsService.connect();
        }
        setIsConnected(true);
        console.log("WebSocket connected:", wsService.isConnected());

        if (roomId) {
          console.log("Fetching messages for room:", roomId);
          const room = await dbService.getChatRoom(roomId);
          if (!room) {
            throw new Error("Chat room not found");
          }

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
        await dbService.saveMessage(data);
        
        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          console.error("User phone not found in localStorage");
          return;
        }

        const room = await dbService.getChatRoom(data.roomId);
        if (!room) {
          console.error("Chat room not found for message:", data);
          return;
        }

        const currentUserParticipant = room.participants.find(p => p.phone === userPhone);
        const isSender = currentUserParticipant?.id === data.senderId;

        setMessages(prev => [...prev, transformChatMessage(data)]);
      }
    };

    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      console.log("Received messages:", data);
      if (data.action === "getMessages" && data.messages) {
        await dbService.saveMessages(data.messages);

        const userPhone = localStorage.getItem("userPhone");
        if (!userPhone) {
          console.error("User phone not found in localStorage");
          return;
        }

        const room = await dbService.getChatRoom(roomId);
        if (!room) {
          console.error("Chat room not found");
          return;
        }

        setMessages(prev => [...prev, ...data.messages.map(transformChatMessage)]);
      }
    };

    const unsubscribeNew = wsService.subscribe("chat", "sendMessage", handleNewMessage);
    const unsubscribeReceived = wsService.subscribe("chat", "getMessages", handleReceivedMessages);

    if (roomId) {
      console.log("Initializing chat with roomId:", roomId);
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