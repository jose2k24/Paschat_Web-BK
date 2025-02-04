import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { dbService } from "@/services/db";
import { toast } from "sonner";
import { Contact } from "@/types/chat";

interface ContactListProps {
  onSelectContact?: (chatId: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initializeContacts = async () => {
      try {
        await dbService.init();
        const response = await apiService.getSavedContacts();
        if (response.data) {
          const transformedContacts: Contact[] = response.data.map(contact => ({
            phone: contact.phone,
            profile: contact.profile,
            roomId: null
          }));

          await dbService.saveContacts(transformedContacts);

          const roomsResponse = await apiService.getChatRooms();
          if (roomsResponse.data) {
            await Promise.all(roomsResponse.data.map(room => 
              dbService.saveChatRoom({
                roomId: parseInt(room.roomId.toString(), 10),
                roomType: "private",
                createdAt: room.createdAt,
                participants: room.participants,                
              })
            ));

            const updatedContacts = await Promise.all(transformedContacts.map(async contact => {
              const room = roomsResponse.data.find(room => 
                room.participants.some(p => p.phone === contact.phone)
              );
              if (room) {
                const roomId = parseInt(room.roomId.toString(), 10);
                await dbService.updateContactRoomId(contact.phone, roomId);
                return {
                  ...contact,
                  roomId
                };
              }
              return contact;
            }));

            setContacts(updatedContacts);
          }
        }
      } catch (error) {
        console.error("Failed to initialize contacts:", error);
        toast.error("Failed to load contacts");
      }
    };

    initializeContacts();
  }, []);

  const handleContactSelect = async (contact: Contact) => {
    try {
      let roomId = contact.roomId;
      
      if (!roomId) {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) throw new Error("User phone not found");

        const response = await apiService.createChatRoom(userPhone, contact.phone);
        
        if (response.data) {
          roomId = parseInt(response.data.roomId.toString(), 10);
          
          await dbService.saveChatRoom({
            roomId,
            participants: response.data.participants,
            createdAt: response.data.createdAt,
            roomType: "private"
          });

          await dbService.updateContactRoomId(contact.phone, roomId);
        }
      }

      onSelectContact?.(roomId.toString());
      navigate(`/chat/${roomId}`);
    } catch (error) {
      console.error("Error handling contact selection:", error);
      toast.error("Failed to start chat");
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-800">
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
                  alt={contact.phone}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                contact.phone[0]
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">
                {contact.phone}
              </h3>
              <p className="text-sm text-gray-400 truncate">{contact.phone}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};