import { Message } from "@/types/chat";
import { FileIcon, Check, CheckCheck, Play, Download } from "lucide-react";
import { MessageContextMenu } from "./MessageContextMenu";
import { Avatar } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
  isTyping?: boolean;
}

export const MessageList = ({ messages, currentUser, isTyping }: MessageListProps) => {
  const isFirstInGroup = (index: number, message: Message) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.sender_id !== message.sender_id || 
           new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000;
  };

  const isLastInGroup = (index: number, message: Message) => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return nextMessage.sender_id !== message.sender_id || 
           new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime() > 300000;
  };

  const renderMessageContent = (msg: Message) => {
    switch (msg.type) {
      case "text":
        return <p className="text-[15px] leading-relaxed">{msg.content}</p>;
      case "image":
        return (
          <div className="relative group">
            <img
              src={msg.media_url}
              alt={msg.content}
              className="w-full max-w-[300px] rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button className="text-white hover:scale-110 transition-transform">
                Click to view
              </button>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="relative group">
            <video
              src={msg.media_url}
              className="w-full max-w-[300px] rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="w-12 h-12 text-white/90" />
            </div>
          </div>
        );
      case "document":
        return (
          <div className="message-document">
            <FileIcon className="h-6 w-6 text-gray-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{msg.content}</p>
              <p className="text-xs text-gray-400">Document</p>
            </div>
            <Download className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-telegram-darker to-telegram-dark">
      {messages.map((msg, index) => (
        <MessageContextMenu
          key={msg.id}
          messageId={msg.id}
          messageType={msg.type}
          mediaUrl={msg.media_url}
          canDelete={msg.sender_id === currentUser}
        >
          <div className={cn(
            "flex items-end gap-2",
            msg.sender_id === currentUser ? "justify-end" : "justify-start"
          )}>
            {msg.sender_id !== currentUser && isFirstInGroup(index, msg) && (
              <Avatar className="w-8 h-8" />
            )}
            <div className={cn(
              "message",
              msg.sender_id === currentUser ? "message-sent" : "message-received",
              !isLastInGroup(index, msg) && "mb-1"
            )}>
              {isFirstInGroup(index, msg) && (
                <div className="message-group-timestamp">
                  {format(new Date(msg.created_at), "h:mm a")}
                </div>
              )}
              {renderMessageContent(msg)}
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <span className="message-timestamp">
                  {format(new Date(msg.created_at), "h:mm a")}
                </span>
                {msg.sender_id === currentUser && (
                  <span className="message-status">
                    {msg.is_edited && <span>edited</span>}
                    <CheckCheck className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </MessageContextMenu>
      ))}
      {isTyping && (
        <div className="typing-indicator ml-2">
          <div className="typing-dot animate-typing" style={{ animationDelay: "0ms" }} />
          <div className="typing-dot animate-typing" style={{ animationDelay: "150ms" }} />
          <div className="typing-dot animate-typing" style={{ animationDelay: "300ms" }} />
        </div>
      )}
    </div>
  );
};