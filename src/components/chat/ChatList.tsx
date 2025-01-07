import { ChatListItem } from "./ChatListItem";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  online?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onChatSelect: (chatId: string) => void;
}

export const ChatList = ({ chats, selectedChat, onChatSelect }: ChatListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat === chat.id}
          onClick={onChatSelect}
        />
      ))}
    </div>
  );
};