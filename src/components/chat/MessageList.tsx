import { Message } from "@/types/chat";
import { FileIcon } from "lucide-react";
import { MessageContextMenu } from "./MessageContextMenu";

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
  isTyping?: boolean;
}

export const MessageList = ({ messages, currentUser, isTyping }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-telegram-darker to-telegram-dark">
      {messages.map((msg) => (
        <MessageContextMenu
          key={msg.id}
          messageId={msg.id}
          messageType={msg.type}
          mediaUrl={msg.media_url}
          canDelete={msg.sender_id === currentUser}
        >
          <div
            className={`message group relative ${
              msg.sender_id === currentUser
                ? "message-sent"
                : "message-received"
            }`}
          >
            {msg.type === "text" && <p className="text-[15px]">{msg.content}</p>}
            {msg.type === "image" && (
              <img
                src={msg.media_url}
                alt={msg.content}
                className="max-w-[300px] rounded-lg hover:opacity-95 transition-opacity"
                loading="lazy"
              />
            )}
            {msg.type === "video" && (
              <video
                src={msg.media_url}
                controls
                className="max-w-[300px] rounded-lg hover:opacity-95 transition-opacity"
              />
            )}
            {msg.type === "document" && (
              <a
                href={msg.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FileIcon className="h-4 w-4" />
                {msg.content}
              </a>
            )}
            <div className="flex items-center gap-1.5 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        </MessageContextMenu>
      ))}
      {isTyping && (
        <div className="message message-received !bg-gray-800/50 !w-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
    </div>
  );
};