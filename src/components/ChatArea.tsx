import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProfilePopup } from "./ProfilePopup";
import { useMessages } from "@/hooks/useMessages";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage } = useMessages(chatId || groupId || channelId || "");
  const [currentUser] = useState("current_user");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chatId ? mockUsers[chatId] : null;
  const currentGroup = groupId ? mockGroups[groupId] : null;
  const currentChannel = channelId ? mockChannels[channelId] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
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

      await sendMessage(file.name, fileType, mockFileUrl);
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

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col bg-[#0F1621]">
        <ChatHeader 
          onProfileClick={() => setProfileOpen(true)}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />
        <MessageList messages={messages} currentUser={currentUser} />
        {(!currentChannel || currentChannel.isOwner) && (
          <MessageInput
            message={message}
            onMessageChange={setMessage}
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