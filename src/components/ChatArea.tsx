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

// Mock data for users, groups, and channels
const mockUsers: Record<string, { name: string; online: boolean }> = {
  "1": { name: "Pizza", online: true },
  "2": { name: "Elon", online: false },
  "3": { name: "Pasha", online: true },
  "4": { name: "void", online: false },
  "5": { name: "PasChat Support", online: true },
};

const mockGroups: Record<string, { id: string; name: string; membersCount: number; description?: string; isAdmin: boolean }> = {
  "g1": {
    id: "g1",
    name: "Tech Enthusiasts",
    membersCount: 1250,
    description: "A group for tech lovers",
    isAdmin: true,
  },
  "g2": {
    id: "g2",
    name: "Travel Adventures",
    membersCount: 3420,
    description: "Share your travel experiences",
    isAdmin: false,
  },
};

const mockChannels: Record<string, { id: string; name: string; subscribersCount: number; description?: string; isOwner: boolean }> = {
  "c1": {
    id: "c1",
    name: "Tech News Daily",
    subscribersCount: 25000,
    description: "Your daily dose of tech news",
    isOwner: true,
  },
  "c2": {
    id: "c2",
    name: "Movie Reviews",
    subscribersCount: 15000,
    description: "Expert movie reviews and discussions",
    isOwner: false,
  },
};

export const ChatArea = () => {
  const { chatId = "", groupId, channelId } = useParams();
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
  } = useChat(chatId || groupId || channelId || "");

  const currentChat = chatId ? mockUsers[chatId] : null;
  const currentGroup = groupId ? mockGroups[groupId] : null;
  const currentChannel = channelId ? mockChannels[channelId] : null;

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        const behavior = messages.length <= 1 ? "auto" : "smooth";
        messagesEndRef.current.scrollIntoView({ behavior });
      }
    };
    
    scrollToBottom();
    // Ensure scroll after images load
    const timer = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    setTypingStatus(value.length > 0);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const mockFileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "document";

      await sendMessage(file.name, fileType);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Error uploading file:", error);
    }
  };

  const getHeaderInfo = () => {
    if (currentChannel) {
      return {
        title: currentChannel.name,
        subtitle: `${currentChannel.subscribersCount} subscribers`,
      };
    }
    if (currentGroup) {
      return {
        title: currentGroup.name,
        subtitle: `${currentGroup.membersCount} members`,
      };
    }
    if (currentChat) {
      return {
        title: currentChat.name,
        subtitle: currentChat.online ? "online" : "offline",
      };
    }
    return {
      title: "Select a chat",
      subtitle: "",
    };
  };

  if (error) {
    return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col bg-telegram-darker">
        <ChatHeader 
          onProfileClick={() => setProfileOpen(true)}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />
        <MessageList 
          messages={messages}
          currentUser="current_user"
          isTyping={isTyping}
        />
        <div ref={messagesEndRef} />
        {(!currentChannel || currentChannel.isOwner) && (
          <MessageInput
            message={message}
            onMessageChange={handleMessageChange}
            onSend={handleSend}
            onFileClick={() => fileInputRef.current?.click()}
          />
        )}
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
          userName={headerInfo.title}
        />
      </div>
      {currentGroup && <GroupProfileSidebar group={currentGroup} />}
      {currentChannel && <ChannelProfileSidebar channel={currentChannel} />}
    </div>
  );
};