import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { dbService } from "@/services/db";
import { toast } from "sonner";
import { Contact } from "@/types/chat";
import { SearchBar } from "./SearchBar";
import { ContactItem } from "./ContactItem";

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
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.phone}
            contact={contact}
            onClick={() => handleContactSelect(contact)}
          />
        ))}
      </div>
    </div>
  );
};