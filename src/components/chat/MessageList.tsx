import { Message } from "@/types/chat";
import { FileIcon, Check, CheckCheck, Volume2 } from "lucide-react";
import { MessageContextMenu } from "./MessageContextMenu";
import { Avatar } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUser: number;
  isTyping?: boolean;
  onScrollTop?: () => void;
}

export const MessageList = ({ messages, currentUser, isTyping, onScrollTop }: MessageListProps) => {
  const isFirstInStack = (index: number, message: Message) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId;
  };

  const isLastInStack = (index: number, message: Message) => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return nextMessage.senderId !== message.senderId;
  };

  const isNewDay = (index: number, message: Message) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    const prevDate = new Date(prevMessage.createdAt).toDateString();
    const currentDate = new Date(message.createdAt).toDateString();
    return prevDate !== currentDate;
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && onScrollTop) {
      onScrollTop();
    }
  };

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-telegram-darker to-telegram-dark"
      onScroll={handleScroll}
    >
      {messages.map((msg, index) => {
        const isSentByCurrentUser = msg.senderId === currentUser;
        
        return (
          <div key={msg.id}>
            {isNewDay(index, msg) && (
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 text-sm bg-telegram-dark/50 rounded-full text-gray-300">
                  {getDateLabel(new Date(msg.createdAt))}
                </span>
              </div>
            )}
            <MessageContextMenu
              messageId={String(msg.id)}
              messageType={msg.type}
              canDelete={isSentByCurrentUser}
            >
              <div className={cn(
                "flex items-end gap-2",
                isSentByCurrentUser ? "justify-end" : "justify-start"
              )}>
                {!isSentByCurrentUser && isFirstInStack(index, msg) && (
                  <Avatar className="w-8 h-8" />
                )}
                <div
                  className={cn(
                    "message",
                    isSentByCurrentUser ? "message-sent" : "message-received",
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
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </span>
                    {isSentByCurrentUser && (
                      <span className="message-status">
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
          </div>
        );
      })}
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