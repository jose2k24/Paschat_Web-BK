import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { apiService } from "@/services/api";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  type: "text" | "image" | "video" | "document";
  senderId: string;
  recipientId: string;
  roomId: string;
  createdAt: string;
  read: boolean;
  received: boolean;
}

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data]);
      }
    };

    const unsubscribe = wsService.subscribe("sendMessage", handleNewMessage);

    // Request initial messages
    wsService.send({
      action: "getMessages",
      data: {
        chatRoomId: roomId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date: new Date().toISOString().split('T')[0],
      },
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const sendMessage = async (content: string, type: Message["type"] = "text") => {
    try {
      wsService.send({
        action: "sendMessage",
        data: {
          content,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId,
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
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
  };
};