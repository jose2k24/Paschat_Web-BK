import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { dbService } from "@/services/db";

interface Contact {
  phone: string;
  name: string | null;
  profile: string | null;
  roomId: string | null;
}

interface ContactListProps {
  onSelectContact?: (contactId: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchAndStoreContacts = async () => {
      try {
        // Initialize database first
        await dbService.init();
        // Fetch contacts from API
        const response = await apiService.getSavedContacts();
        if (response.data) {
          // Transform and store contacts in local DB
          const contactsToStore = response.data.map(contact => ({
            phone: contact.phone,
            profile: contact.profile,
            name: null, // Will be updated when user sets it
            roomId: null // Will be set when chat is initiated
          }));

          // Store in local database
          await dbService.saveContacts(contactsToStore);
          
          // Get contacts from local DB to display
          const storedContacts = await dbService.getAllContacts();
          setContacts(storedContacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchAndStoreContacts();
  }, []);

  const handleContactSelect = async (contact: Contact) => {
    try {
      if (!contact.roomId) {
        // Create chat room if it doesn't exist
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) throw new Error("User phone not found");

        const response = await apiService.createChatRoom(userPhone, contact.phone);
        
        if (response.data) {
          const { roomId } = response.data;
          
          // Update contact with room ID in local DB
          await dbService.updateContactRoomId(contact.phone, roomId.toString());
          
          // Save chat room details
          await dbService.saveChatRoom({
            roomId: roomId.toString(),
            participants: response.data.participants,
            createdAt: response.data.createdAt,
            roomType: response.data.roomType
          });
          
          onSelectContact?.(contact.phone);
          navigate(`/chat/${roomId}`);
        }
      } else {
        onSelectContact?.(contact.phone);
        navigate(`/chat/${contact.roomId}`);
      }
    } catch (error) {
      console.error("Error handling contact selection:", error);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
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
            key={contact.phone}
            onClick={() => handleContactSelect(contact)}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
              {contact.profile ? (
                <img
                  src={contact.profile}
                  alt={contact.name || contact.phone}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (contact.name?.[0] || contact.phone[0])
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {contact.name || contact.phone}
              </h3>
              <p className="text-sm text-gray-400 truncate">{contact.phone}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
