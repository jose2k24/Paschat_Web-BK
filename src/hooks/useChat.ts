import { useState, useEffect } from "react";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, ChatMessage } from "@/types/chat";
import { toast } from "sonner";

export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);

        // Fetch local messages from the database
        const localMessages = await dbService.getMessagesByRoom(roomId);
        if (localMessages.length > 0) {
          setMessages(localMessages);
        }

        // Connect to WebSocket
        wsService.connect();

        // Fetch today's messages from the server
        const today = new Date().toISOString().split("T")[0];
        wsService.send({
          action: "getMessages",
          data: {
            chatRoomId: roomId,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            date: today,
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

    // Handle new message event
    const handleNewMessage = (data: ChatMessage) => {
      if (data.roomId.toString() === roomId) {
        const newMessage: Message = {
          id: data.id.toString(),
          content: data.content,
          sender_id: data.senderId.toString(),
          chat_id: data.roomId.toString(),
          type: data.type,
          is_edited: false,
          created_at: data.createdAt,
        };
        setMessages((prev) => [...prev, newMessage]);
        dbService.saveMessage(data);
      }
    };

    // Handle received messages event
    const handleReceivedMessages = async (data: { action: string; messages: ChatMessage[] }) => {
      if (data.action === "getMessages") {
        const newMessages = data.messages.map((msg) => ({
          id: msg.id.toString(),
          content: msg.content,
          sender_id: msg.senderId.toString(),
          chat_id: msg.roomId.toString(),
          type: msg.type,
          is_edited: false,
          created_at: msg.createdAt,
        }));

        await dbService.saveMessages(data.messages); // Save to the database
        setMessages((prev) => [...prev, ...newMessages]);
        setHasMore(data.messages.length > 0); // Check if there are more messages to load
      }
    };

    // Subscribe to WebSocket events
    const unsubscribeNew = wsService.subscribe("sendMessage", handleNewMessage);
    const unsubscribeReceived = wsService.subscribe("getMessages", handleReceivedMessages);

    // Cleanup on unmount
    return () => {
      unsubscribeNew();
      unsubscribeReceived();
    };
  }, [roomId]);

  const loadMoreMessages = async (date: string) => {
    wsService.send({
      action: "getMessages",
      data: {
        chatRoomId: roomId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date,
      },
    });
  };

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    try {
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
    hasMore,
    sendMessage,
    setTypingStatus,
    loadMoreMessages,
  };
};
