import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user?.id || null);
    });
  }, []);

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
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${chatId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-media")
        .getPublicUrl(filePath);

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "document";

      await sendMessage(file.name, fileType, publicUrl);
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