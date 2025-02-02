import { Message } from "@/types/chat";
import { FileIcon, Check, CheckCheck, Volume2 } from "lucide-react";
import { MessageContextMenu } from "./MessageContextMenu";
import { Avatar } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUser: number;
  isTyping?: boolean;
}

export const MessageList = ({ messages, currentUser, isTyping }: MessageListProps) => {
  const isFirstInStack = (index: number, message: Message) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.sender_id !== message.sender_id;
  };

  const isLastInStack = (index: number, message: Message) => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return nextMessage.sender_id !== message.sender_id;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-telegram-darker to-telegram-dark">
      {messages.map((msg, index) => (
        <MessageContextMenu
          key={msg.id}
          messageId={String(msg.id)}
          messageType={msg.type}
          canDelete={msg.sender_id === currentUser}
        >
          <div className={cn(
            "flex items-end gap-2",
            msg.sender_id === currentUser ? "justify-end" : "justify-start"
          )}>
            {msg.sender_id !== currentUser && isFirstInStack(index, msg) && (
              <Avatar className="w-8 h-8" />
            )}
            <div
              className={cn(
                "message group max-w-[70%]",
                msg.sender_id === currentUser ? "message-sent bg-telegram-blue" : "message-received bg-telegram-message",
                !isLastInStack(index, msg) && "mb-1"
              )}
            >
              {msg.type === "text" && (
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              )}
              {msg.type === "image" && (
                <img
                  src={msg.content}
                  alt="Image message"
                  className="w-full rounded-md"
                  loading="lazy"
                />
              )}
              {msg.type === "video" && (
                <video
                  src={msg.content}
                  controls
                  className="w-full rounded-md"
                />
              )}
              {msg.type === "audio" && (
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <audio src={msg.content} controls className="max-w-[200px]" />
                </div>
              )}
              {msg.type === "document" && (
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-200 hover:text-blue-100 transition-colors"
                >
                  <FileIcon className="h-4 w-4" />
                  <span className="truncate">{msg.content}</span>
                </a>
              )}
              <div className="flex items-center gap-1.5 justify-end mt-1 text-xs text-gray-300">
                <span className="message-timestamp">
                  {format(new Date(msg.created_at), "HH:mm")}
                </span>
                {msg.sender_id === currentUser && (
                  <span className="message-status">
                    {msg.is_edited && <span className="mr-1">edited</span>}
                    {msg.read ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
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