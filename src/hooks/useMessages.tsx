import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  type: "text" | "image" | "video" | "document";
  media_url?: string;
  is_edited: boolean;
  created_at: string;
}

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(chatId)) {
        throw new Error("Invalid chat ID format. Expected UUID format.");
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return data.map((msg: any) => ({
        ...msg,
        type: msg.type as Message["type"]
      })) as Message[];
    },
    enabled: Boolean(chatId), // Only run query if chatId exists
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            type: payload.new.type as Message["type"]
          } as Message;
          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const sendMessage = async (content: string, type: Message["type"] = "text", mediaUrl?: string) => {
    try {
      // Validate UUID format before sending
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(chatId)) {
        toast.error("Invalid chat ID format");
        return;
      }

      const { error } = await supabase.from("messages").insert({
        content,
        chat_id: chatId,
        type,
        media_url: mediaUrl,
      });

      if (error) throw error;
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