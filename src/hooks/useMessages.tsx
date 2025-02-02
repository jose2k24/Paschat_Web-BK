import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      content: "Hey there!",
      sender_id: 1,
      chat_id: 1,
      type: "text",
      is_edited: false,
      created_at: new Date().toISOString(),
      read: false,
      received: false,
      delete_flag: false,
      report_flag: false,
      views: 0,
      comments: null,
      reactions: null,
      call_type: null
    },
    {
      id: 2,
      content: "Hi! How are you?",
      sender_id: 2,
      chat_id: 1,
      type: "text",
      is_edited: false,
      created_at: new Date().toISOString(),
      read: false,
      received: false,
      delete_flag: false,
      report_flag: false,
      views: 0,
      comments: null,
      reactions: null,
      call_type: null
    },
  ],
  2: [
    {
      id: 3,
      content: "Hello from chat 2!",
      sender_id: 3,
      chat_id: 2,
      type: "text",
      is_edited: false,
      created_at: new Date().toISOString(),
      read: false,
      received: false,
      delete_flag: false,
      report_flag: false,
      views: 0,
      comments: null,
      reactions: null,
      call_type: null
    },
  ],
};

export const useMessages = (chatId: number) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages[chatId] || []);

  useEffect(() => {
    setMessages(mockMessages[chatId] || []);
  }, [chatId]);

  const sendMessage = async (content: string, type: Message["type"] = "text") => {
    const newMessage: Message = {
      id: Date.now(),
      content,
      chat_id: chatId,
      sender_id: 1,
      type,
      is_edited: false,
      created_at: new Date().toISOString(),
      read: false,
      received: false,
      delete_flag: false,
      report_flag: false,
      views: 0,
      comments: null,
      reactions: null,
      call_type: null
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  return {
    messages,
    sendMessage,
  };
};