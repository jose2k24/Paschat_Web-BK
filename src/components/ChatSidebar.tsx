import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatTabs } from "./chat/ChatTabs";
import { ChatSearch } from "./chat/ChatSearch";
import { ChatList } from "./chat/ChatList";
import { StoriesSection } from "./chat/StoriesSection";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "@/services/db";
import { Contact } from "@/types/chat";

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
  const [contacts, setContacts] = useState<Chat[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const savedContacts = await dbService.getContacts();
        const chatRooms = await dbService.getAllChatRooms();
        
        const contactsWithMessages = await Promise.all(
          savedContacts.map(async (contact) => {
            const room = chatRooms.find(room => room.roomId === contact.roomId);
            const messages = room ? await dbService.getMessagesByRoom(room.roomId) : [];
            const lastMessage = messages[messages.length - 1];
            
            return {
              id: contact.roomId?.toString() || contact.phone,
              name: contact.phone,
              lastMessage: lastMessage?.content || "No messages yet",
              time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : "",
              avatar: contact.profile || undefined,
              online: false, // You can implement online status logic here
              unread: messages.filter(msg => !msg.read).length
            };
          })
        );

        setContacts(contactsWithMessages);
      } catch (error) {
        console.error("Failed to load contacts:", error);
        toast.error("Failed to load contacts");
      }
    };

    loadContacts();
  }, []);

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

  const handleNewChat = () => {
    navigate('/contacts');
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
        return contacts.filter(chat => 
          chat.name.toLowerCase().includes(searchLower)
        );
    }
  };

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-telegram-dark text-white relative">
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
      <Button
        onClick={handleNewChat}
        className="absolute bottom-6 right-6 rounded-full w-14 h-14 bg-telegram-blue hover:bg-telegram-hover shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};