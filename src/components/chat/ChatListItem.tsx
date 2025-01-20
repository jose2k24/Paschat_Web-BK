import { Check } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  online?: boolean;
}

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: (chatId: string) => void;
}

export const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  return (
    <div
      className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ${
        isSelected ? "bg-gray-800/50" : ""
      }`}
      onClick={() => onClick(chat.id)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-telegram-blue to-telegram-secondary flex items-center justify-center text-lg font-medium text-white transition-transform duration-200 hover:scale-105">
            {chat.avatar ? (
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              chat.name[0]
            )}
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-telegram-dark" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{chat.name}</span>
            <span className="text-sm text-gray-400 ml-2 shrink-0 flex items-center gap-1">
              {chat.time}
              <Check className="h-4 w-4 text-telegram-blue" />
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-400 truncate">
              {chat.lastMessage}
            </span>
            {chat.unread && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-telegram-blue text-white rounded-full shrink-0 animate-scale-in">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};