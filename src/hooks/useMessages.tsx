import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const mockMessages: Record<string, Message[]> = {
  "1": [
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
  ],
  "2": [
    {
      id: "3",
      content: "Hello from chat 2!",
      sender_id: "user2",
      chat_id: "2",
      type: "text",
      is_edited: false,
      created_at: new Date().toISOString(),
    },
  ],
};

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatId] || []);

  useEffect(() => {
    // Update messages when chatId changes
    setMessages(mockMessages[chatId] || []);
  }, [chatId]);

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      chat_id: chatId,
      sender_id: "current_user",
      type,
      media_url: mediaUrl,
      is_edited: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    // Here you would typically make an API call to your backend
    return newMessage;
  };

  return {
    messages,
    sendMessage,
  };
};