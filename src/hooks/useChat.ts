import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { Message } from "@/types/chat";

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

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    try {
      const message: Partial<Message> = {
        content,
        type,
        chat_id: roomId,
        sender_id: "current_user",
        is_edited: false,
        created_at: new Date().toISOString(),
        media_url: mediaUrl,
      };

      wsService.send({
        action: "sendMessage",
        data: message,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
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