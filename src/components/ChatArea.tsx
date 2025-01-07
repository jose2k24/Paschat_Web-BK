import { useState, useRef } from "react";
import { Send, ArrowLeft, Link2, Image, FileVideo, File } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfilePopup } from "./ProfilePopup";
import { ChatMenu } from "./chat/ChatMenu";
import { useMessages } from "@/hooks/useMessages";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ChatArea = () => {
  const { chatId = "" } = useParams();
  const [message, setMessage] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage } = useMessages(chatId);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Get current user on component mount
  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user?.id || null);
    });
  }, []);

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
      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setProfileOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
            M
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Muste</h2>
            <p className="text-sm text-gray-400">online</p>
          </div>
        </div>
        <ChatMenu />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender_id === currentUser
                ? "message-sent"
                : "message-received"
            }`}
          >
            {msg.type === "text" && <p>{msg.content}</p>}
            {msg.type === "image" && (
              <img
                src={msg.media_url}
                alt={msg.content}
                className="max-w-[300px] rounded-lg"
              />
            )}
            {msg.type === "video" && (
              <video
                src={msg.media_url}
                controls
                className="max-w-[300px] rounded-lg"
              />
            )}
            {msg.type === "document" && (
              <a
                href={msg.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <File className="h-4 w-4" />
                {msg.content}
              </a>
            )}
            <div className="flex items-center gap-1 text-xs mt-1">
              <span className="text-gray-400">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {msg.is_edited && (
                <span className="text-gray-400">• edited</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,application/*"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Link2 className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
          />
          <Button
            onClick={handleSend}
            className="bg-telegram-blue hover:bg-telegram-hover text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ProfilePopup open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};