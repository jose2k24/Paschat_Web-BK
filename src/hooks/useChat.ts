import { useState, useEffect, useCallback } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, GetMessagesRequest, transformChatMessage } from "@/types/chat";
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

  const fetchLastMonthMessages = useCallback(async () => {
    const today = startOfDay(new Date());
    const oneMonthAgo = subDays(today, 30);
    let currentDate = today;

    while (currentDate >= oneMonthAgo) {
      await fetchMessagesForDate(currentDate);
      currentDate = subDays(currentDate, 1);
      // Add a small delay between requests to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setOldestLoadedDate(oneMonthAgo);
  }, [fetchMessagesForDate]);

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

          // Load initial messages from local DB
          const localMessages = await dbService.getMessagesByRoom(roomId);
          setMessages(localMessages);

          // Fetch last month's messages
          await fetchLastMonthMessages();
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
  }, [roomId, fetchLastMonthMessages]);

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

      // Prepare the message payload according to the type
      let messageContent = content;
      if (type !== "text") {
        messageContent = JSON.stringify({
          mediaUrl: content,
          fileSize: "1mb" // This should be calculated based on the actual file size
        });
      }

      // Send the properly formatted WebSocket request
      await wsService.send({
        action: "sendMessage",
        data: {
          content: messageContent,
          dataType: type,
          createdAt: new Date().toISOString(),
          roomId,
          recipientId: recipient.id
        }
      });

      // Save message to local database
      const newMessage: Message = {
        id: Date.now(), // Temporary ID until server responds
        type,
        content: messageContent,
        senderId: parseInt(userPhone),
        recipientId: recipient.id,
        roomId,
        replyTo: null,
        createdAt: new Date().toISOString(),
        read: false,
        received: false,
        deleteFlag: false,
        callType: null
      };

      await dbService.saveMessage(newMessage);
      setMessages(prev => [...prev, newMessage]);

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