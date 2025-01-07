import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatTabs } from "./chat/ChatTabs";
import { ChatSearch } from "./chat/ChatSearch";
import { ChatList } from "./chat/ChatList";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  online?: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Pizza",
    lastMessage: "Yes, they are necessary",
    time: "11:38 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Elon",
    lastMessage: "I love /r/Reddit!",
    time: "12:44 AM",
  },
  {
    id: "3",
    name: "Pasha",
    lastMessage: "How are u?",
    time: "Fri",
    online: true,
  },
  {
    id: "4",
    name: "void",
    lastMessage: "Hamsters day!!!",
    time: "11:38",
  },
  {
    id: "5",
    name: "PasChat Support",
    lastMessage: "Yes it happened.",
    time: "Thu",
    unread: 1,
  },
];

export const ChatSidebar = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "group" | "channel">("all");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="w-full md:w-80 h-full border-r flex flex-col bg-telegram-dark text-white">
      <div className="p-4 border-b border-gray-700">
        <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ChatSearch value={search} onChange={setSearch} />
      </div>
      <ChatList
        chats={mockChats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
      />
    </div>
  );
};