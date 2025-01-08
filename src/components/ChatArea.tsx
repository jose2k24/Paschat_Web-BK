import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProfilePopup } from "./ProfilePopup";
import { useMessages } from "@/hooks/useMessages";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";

export const ChatArea = () => {
  const { chatId = "" } = useParams();
  const [message, setMessage] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage } = useMessages(chatId);
  const [currentUser] = useState("current_user");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Mock file upload - replace with your actual file upload logic
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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0F1621]">
      <ChatHeader onProfileClick={() => setProfileOpen(true)} />
      <MessageList messages={messages} currentUser={currentUser} />
      <MessageInput
        message={message}
        onMessageChange={setMessage}
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
      <ProfilePopup open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};