import { useState, useEffect, useCallback } from "react";
import { format, subDays, startOfDay, isToday, isYesterday } from "date-fns";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, GetMessagesRequest, transformChatMessage, MessageGroup } from "@/types/chat";
import { toast } from "sonner";

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [oldestLoadedDate, setOldestLoadedDate] = useState<Date>(new Date());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMessagesForDate = useCallback(async (date: Date) => {
    const request: GetMessagesRequest = {
      chatRoomId: roomId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: format(date, 'yyyy-MM-dd'),
    };

    console.log("Fetching messages for date:", request.date);
    await wsService.send({
      action: "getMessages",
      data: request
    });
  }, [roomId]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextDate = subDays(oldestLoadedDate, 1);
      await fetchMessagesForDate(nextDate);
      setOldestLoadedDate(nextDate);
    } catch (error) {
      console.error("Error loading more messages:", error);
      toast.error("Failed to load older messages");
    } finally {
      setIsLoadingMore(false);
    }
  }, [oldestLoadedDate, isLoadingMore, fetchMessagesForDate]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await dbService.init();

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No auth token found");
        }

        if (!wsService.isConnected()) {
          console.log("Initializing WebSocket connection...");
          await wsService.connect();
        }
        setIsConnected(true);

        if (roomId) {
          console.log("Fetching messages for room:", roomId);
          const room = await dbService.getChatRoom(roomId);
          if (!room) {
            throw new Error("Chat room not found");
          }

          // Fetch last 30 days of messages
          const today = startOfDay(new Date());
          setOldestLoadedDate(today);
          
          // Load initial messages from local DB
          const localMessages = await dbService.getMessagesByRoom(roomId);
          setMessages(localMessages);

          // Fetch today's messages first
          await fetchMessagesForDate(today);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to load messages");
        setIsLoading(false);
      }
    };

    const handleNewMessage = async (data: any) => {
      console.log("Received new message:", data);
      if (data.roomId === roomId) {
        const message = transformChatMessage(data);
        await dbService.saveMessage(message);
        setMessages(prev => [...prev, message]);
      }
    };

    const handleReceivedMessages = async (data: any) => {
      console.log("Received messages:", data);
      if (data.action === "getMessages" && data.messages) {
        const transformedMessages = data.messages.map(transformChatMessage);
        await dbService.saveMessages(transformedMessages);
        setMessages(prev => {
          const combined = [...prev, ...transformedMessages];
          // Remove duplicates based on message ID
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          // Sort by creation date
          return unique.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      }
    };

    const unsubscribeNew = wsService.subscribe("chat", "sendMessage", handleNewMessage);
    const unsubscribeReceived = wsService.subscribe("chat", "getMessages", handleReceivedMessages);

    if (roomId) {
      console.log("Initializing chat with roomId:", roomId);
      initializeChat();
    }

    return () => {
      unsubscribeNew();
      unsubscribeReceived();
    };
  }, [roomId, fetchMessagesForDate]);

  const sendMessage = async (content: string, type: Message["type"] = "text") => {
    if (!roomId) {
      toast.error("Chat room not initialized");
      return;
    }

    try {
      const chatRoom = await dbService.getChatRoom(roomId);
      if (!chatRoom) throw new Error("Chat room not found");

      const userPhone = localStorage.getItem("userPhone");
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
    loadMoreMessages,
    isLoadingMore
  };
};