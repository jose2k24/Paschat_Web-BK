import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      content: "Hey there!",
      senderId: 1,
      recipientId: 2,
      roomId: 1,
      type: "text",
      replyTo: null,
      createdAt: new Date().toISOString(),
      read: false,
      received: false,
      deleteFlag: false,
      callType: null
    },
    {
      id: 2,
      content: "Hi! How are you?",
      senderId: 2,
      recipientId: 1,
      roomId: 1,
      type: "text",
      replyTo: null,
      createdAt: new Date().toISOString(),
      read: false,
      received: false,
      deleteFlag: false,
      callType: null
    },
  ],
  2: [
    {
      id: 3,
      content: "Hello from chat 2!",
      senderId: 3,
      recipientId: 1,
      roomId: 2,
      type: "text",
      replyTo: null,
      createdAt: new Date().toISOString(),
      read: false,
      received: false,
      deleteFlag: false,
      callType: null
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
      roomId: chatId,
      senderId: 1,
      recipientId: 2,
      type,
      replyTo: null,
      createdAt: new Date().toISOString(),
      read: false,
      received: false,
      deleteFlag: false,
      callType: null
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  return {
    messages,
    sendMessage,
  };
};