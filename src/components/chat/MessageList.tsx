import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
}

export const MessageList = ({ messages, currentUser }: MessageListProps) => {
  return (
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
  );
};