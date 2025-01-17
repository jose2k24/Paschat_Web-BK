import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatTabs } from "./chat/ChatTabs";
import { ChatSearch } from "./chat/ChatSearch";
import { ChatList } from "./chat/ChatList";
import { StoriesSection } from "./chat/StoriesSection";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
  online?: boolean;
}

interface Group extends Chat {
  membersCount: number;
  isAdmin: boolean;
  description?: string;
}

interface Channel extends Chat {
  subscribersCount: number;
  isOwner: boolean;
  description?: string;
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

const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Tech Enthusiasts",
    lastMessage: "Check out this new framework!",
    time: "12:30 PM",
    membersCount: 1250,
    isAdmin: true,
    description: "A group for tech lovers",
    unread: 5,
  },
  {
    id: "g2",
    name: "Travel Adventures",
    lastMessage: "Anyone planning a trip to Japan?",
    time: "10:15 AM",
    membersCount: 3420,
    isAdmin: false,
    description: "Share your travel experiences",
    unread: 2,
  },
];

const mockChannels: Channel[] = [
  {
    id: "c1",
    name: "Tech News Daily",
    lastMessage: "Latest AI developments in 2024",
    time: "2:45 PM",
    subscribersCount: 25000,
    isOwner: true,
    description: "Your daily dose of tech news",
    unread: 1,
  },
  {
    id: "c2",
    name: "Movie Reviews",
    lastMessage: "Top 10 movies of the month",
    time: "Yesterday",
    subscribersCount: 15000,
    isOwner: false,
    description: "Expert movie reviews and discussions",
  },
];

export const ChatSidebar = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "group" | "channel">("all");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    if (chatId.startsWith('g')) {
      navigate(`/group/${chatId}`);
    } else if (chatId.startsWith('c')) {
      navigate(`/channel/${chatId}`);
    } else {
      navigate(`/chat/${chatId}`);
    }
  };

  const getFilteredItems = () => {
    const searchLower = search.toLowerCase();
    switch (activeTab) {
      case "group":
        return mockGroups.filter(group => 
          group.name.toLowerCase().includes(searchLower)
        );
      case "channel":
        return mockChannels.filter(channel => 
          channel.name.toLowerCase().includes(searchLower)
        );
      default:
        return mockChats.filter(chat => 
          chat.name.toLowerCase().includes(searchLower)
        );
    }
  };

  return (
    <div className="w-full md:w-80 h-full border-r flex flex-col bg-telegram-dark text-white">
      <div className="p-4 border-b border-gray-700">
        <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ChatSearch value={search} onChange={setSearch} />
      </div>
      <StoriesSection />
      <div className="flex-1 overflow-y-auto transition-all duration-300">
        <ChatList
          chats={getFilteredItems()}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </div>
    </div>
  );
};