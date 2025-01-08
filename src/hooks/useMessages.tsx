import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import { websocketService } from "@/services/websocket";
import { Message } from "@/types/chat";

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey there!",
    sender_id: "user1",
    chat_id: "1",
    type: "text",
    is_edited: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    content: "Hi! How are you?",
    sender_id: "current_user",
    chat_id: "1",
    type: "text",
    is_edited: false,
    created_at: new Date().toISOString(),
  },
];

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      // In production, replace with actual API call
      return mockMessages;
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = websocketService.subscribe((message) => {
      if (message.chatId === chatId) {
        setMessages((current) => [...current, message]);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    try {
      const newMessage = {
        id: Date.now().toString(),
        content,
        chat_id: chatId,
        sender_id: "current_user",
        type,
        media_url: mediaUrl,
        is_edited: false,
        created_at: new Date().toISOString(),
      };

      websocketService.send({
        type: "chat_message",
        data: newMessage,
      });

      setMessages((current) => [...current, newMessage]);
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};