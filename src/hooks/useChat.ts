import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { Message } from "@/types/chat";
import { toast } from "sonner";

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    wsService.connect();

    const handleNewMessage = (data: Message) => {
      if (data.chat_id === roomId) {
        setMessages(prev => [...prev, data]);
      }
    };

    const unsubscribe = wsService.subscribe("sendMessage", handleNewMessage);

    // Get messages for the room
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

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error("User not logged in");

      wsService.send({
        action: "sendMessage",
        data: {
          content,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId,
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
  };
};