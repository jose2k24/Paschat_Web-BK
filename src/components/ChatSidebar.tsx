import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

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
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            All Chats
          </button>
          <button
            onClick={() => setActiveTab("group")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "group"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Group
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-pink-500 text-white rounded-full">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveTab("channel")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "channel"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Channel
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-pink-500 text-white rounded-full">
              2
            </span>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats"
            className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
              selectedChat === chat.id ? "bg-gray-800/50" : ""
            }`}
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium">
                  {chat.name[0]}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-telegram-dark" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{chat.name}</span>
                  <span className="text-sm text-gray-400 ml-2 shrink-0">
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-400 truncate">
                    {chat.lastMessage}
                  </span>
                  {chat.unread && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-pink-500 text-white rounded-full shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};