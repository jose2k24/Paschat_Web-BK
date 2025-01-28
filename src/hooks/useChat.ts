import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage, transformChatMessage } from "@/types/chat";
import { toast } from "sonner";

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Get messages from local DB first
        const localMessages = await dbService.getMessagesByRoom(roomId);
        if (localMessages.length > 0) {
          setMessages(localMessages);
        }

        // Connect to WebSocket
        wsService.connect();

        // Get messages from server
        wsService.send({
          action: "getMessages",
          data: {
            chatRoomId: roomId,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            date: new Date().toISOString().split('T')[0],
          },
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to load messages");
        toast.error("Failed to load messages");
      }
    };

    initializeChat();

    // Handle new messages
    const handleNewMessage = (data: ChatMessage) => {
      if (data.roomId.toString() === roomId) {
        const transformedMessage = transformChatMessage(data);
        setMessages(prev => [...prev, transformedMessage]);
        dbService.saveMessage(data);
      }
    };

    const unsubscribe = wsService.subscribe("sendMessage", handleNewMessage);

    // Handle received messages
    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      if (data.action === "getMessages") {
        await dbService.saveMessages(data.messages);
        const transformedMessages = data.messages.map(transformChatMessage);
        setMessages(transformedMessages);
      }
    };

    const unsubscribeMessages = wsService.subscribe("getMessages", handleReceivedMessages);

    return () => {
      unsubscribe();
      unsubscribeMessages();
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