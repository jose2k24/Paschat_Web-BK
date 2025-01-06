import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Alice Smith",
    lastMessage: "Hey, how are you?",
    time: "12:30",
    unread: 2,
  },
  {
    id: "2",
    name: "Bob Johnson",
    lastMessage: "See you tomorrow!",
    time: "11:45",
  },
  {
    id: "3",
    name: "Carol Williams",
    lastMessage: "Thanks for the help!",
    time: "09:15",
  },
];

export const ChatSidebar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full md:w-80 h-full border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 hover:bg-secondary cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{chat.name}</span>
              <span className="text-sm text-muted-foreground">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </span>
              {chat.unread && (
                <span className="bg-telegram-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};