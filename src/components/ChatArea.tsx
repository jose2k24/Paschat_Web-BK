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

// Mock data for users
const mockUsers: Record<string, { name: string; online: boolean }> = {
  "1": { name: "Pizza", online: true },
  "2": { name: "Elon", online: false },
  "3": { name: "Pasha", online: true },
  "4": { name: "void", online: false },
  "5": { name: "PasChat Support", online: true },
};

export const ChatArea = () => {
  const { chatId = "", groupId, channelId } = useParams();
  const [message, setMessage] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage } = useMessages(chatId || groupId || channelId || "");
  const [currentUser] = useState("current_user");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const currentGroup = {
    id: groupId || "",
    name: "Tech Enthusiasts",
    membersCount: 1250,
    description: "A group for tech lovers",
    isAdmin: true,
  };

  const currentChannel = {
    id: channelId || "",
    name: "Tech News Daily",
    subscribersCount: 25000,
    description: "Your daily dose of tech news",
    isOwner: false,
  };

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

  const isChannel = !!channelId;
  const isGroup = !!groupId;
  const currentChat = chatId ? mockUsers[chatId] : null;

  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col bg-[#0F1621]">
        <ChatHeader 
          onProfileClick={() => setProfileOpen(true)}
          title={isGroup ? currentGroup.name : isChannel ? currentChannel.name : currentChat?.name || "Chat"}
          subtitle={isGroup ? `${currentGroup.membersCount} members` : isChannel ? `${currentChannel.subscribersCount} subscribers` : currentChat?.online ? "online" : "offline"}
        />
        <MessageList messages={messages} currentUser={currentUser} />
        {(!isChannel || currentChannel.isOwner) && (
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
          userName={currentChat?.name || ""}
        />
      </div>
      {isGroup && <GroupProfileSidebar group={currentGroup} />}
      {isChannel && <ChannelProfileSidebar channel={currentChannel} />}
    </div>
  );
};