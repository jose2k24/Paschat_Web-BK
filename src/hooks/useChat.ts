import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage } from "@/types/chat";
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

    if (roomId) {
      initializeChat();
    }

    const handleNewMessage = async (data: ChatMessage) => {
      console.log("Received new message:", data);
      if (data.roomId === roomId) {
        await dbService.saveMessage(data);
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
        await dbService.saveMessages(data.messages);
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

    return () => {
      unsubscribeNew();
      unsubscribeReceived();
    };
  }, [roomId]);

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    if (!roomId) {
      toast.error("Chat room not initialized");
      return;
    }

    try {
      const chatRoom = await dbService.getChatRoom(roomId);
      if (!chatRoom) throw new Error("Chat room not found");

      const userPhone = localStorage.getItem('userPhone');
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
          mediaUrl,
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