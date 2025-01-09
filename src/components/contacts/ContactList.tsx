import React, { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  username: string;
  phone: string;
  lastSeen: string;
  avatar?: string;
  online?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "José",
    username: "eschool.et",
    phone: "+251 91 234 5678",
    lastSeen: "online",
    online: true
  },
  {
    id: "2",
    name: "Muste",
    username: "@Dech_u",
    phone: "+251 91 067 5097",
    lastSeen: "last seen recently"
  },
  {
    id: "3",
    name: "Yoni D",
    username: "@yoni",
    phone: "+251 91 234 5678",
    lastSeen: "last seen recently"
  },
  {
    id: "4",
    name: "Byron Trokon Geply",
    username: "@byron",
    phone: "+251 91 234 5678",
    lastSeen: "last seen recently"
  }
];

interface ContactListProps {
  onSelectContact: (contactId: string) => void;
}

export const ContactList = ({ onSelectContact }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-white font-medium">Contacts</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts"
            className="pl-9 bg-gray-800 border-none text-white placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  contact.name[0]
                )}
              </div>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-telegram-dark" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-white font-medium truncate">{contact.name}</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {contact.lastSeen}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">{contact.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};