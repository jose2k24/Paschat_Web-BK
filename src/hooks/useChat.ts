import { useState, useEffect } from "react";
import { format } from "date-fns";
import { wsService } from "@/services/websocket";
import { dbService } from "@/services/db";
import { Message, GetMessagesRequest, transformChatMessage } from "@/types/chat";
import { toast } from "sonner";

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

          const request: GetMessagesRequest = {
            chatRoomId: roomId,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            date: format(new Date(), 'yyyy-MM-dd'),
            communityId: 0 // Adding default communityId for private chats
          };

          console.log("Sending getMessages request:", request);
          await wsService.send({
            action: "getMessages",
            data: request
          });

          // Load existing messages from local DB while waiting for new ones
          const localMessages = await dbService.getMessagesByRoom(roomId);
          setMessages(localMessages);
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
        setMessages(prev => [...prev, ...transformedMessages]);
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
  }, [roomId]);

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
          recipientId: recipient.id,
          communityId: 0 // Adding default communityId for private messages
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