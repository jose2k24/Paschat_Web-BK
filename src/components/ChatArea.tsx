import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProfilePopup } from "./ProfilePopup";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { GroupProfileSidebar } from "./group/GroupProfileSidebar";
import { ChannelProfileSidebar } from "./channel/ChannelProfileSidebar";

export const ChatArea = () => {
  const { chatId = "0", groupId = "0", channelId = "0" } = useParams<{
    chatId?: string;
    groupId?: string;
    channelId?: string;
  }>();
  const [message, setMessage] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    setTypingStatus,
    isConnected
  } = useChat(parseInt(chatId || groupId || channelId || "0", 10));

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        const behavior = messages.length <= 1 ? "auto" : "smooth";
        messagesEndRef.current.scrollIntoView({ behavior });
      }
    };
    
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      setTypingStatus(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTypingStatus(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, isTyping, setTypingStatus]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await sendMessage(message);
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://vps.paschat.net/api/v1/file/upload/media", {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem("authToken") || "",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      await sendMessage(file.name, file.type.split("/")[0] as "image" | "video" | "document" | "audio");
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Error uploading file:", error);
    }
  };

  if (error) {
    return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
  }

  if (isLoading || !isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-400">{!isConnected ? "Connecting to chat..." : "Loading messages..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col bg-telegram-darker">
        <ChatHeader 
          onProfileClick={() => setProfileOpen(true)}
          title={chatId || groupId || channelId || "0"}
          subtitle={isTyping ? "typing..." : ""}
        />
        <MessageList 
          messages={messages}
          currentUser={parseInt(localStorage.getItem("userPhone") || "0", 10)}
          isTyping={isTyping}
        />
        <div ref={messagesEndRef} />
        <MessageInput
          message={message}
          onMessageChange={handleMessageChange}
          onSend={handleSend}
          onFileClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,application/*"
        />
        <ProfilePopup 
          open={profileOpen}
          onOpenChange={setProfileOpen}
          userName={chatId || groupId || channelId || "0"}
        />
      </div>
      {groupId !== "0" && (
        <GroupProfileSidebar 
          group={{ 
            id: groupId,
            name: "", 
            membersCount: 0, 
            isAdmin: false 
          }} 
        />
      )}
      {channelId !== "0" && (
        <ChannelProfileSidebar 
          channel={{ 
            id: channelId,
            name: "", 
            subscribersCount: 0, 
            isOwner: false 
          }} 
        />
      )}
    </div>
  );
};