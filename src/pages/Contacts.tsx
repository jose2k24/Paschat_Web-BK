import React, { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ContactInfo } from "@/components/contacts/ContactInfo";
import { ContactList } from "@/components/contacts/ContactList";
import { ChatArea } from "@/components/ChatArea";

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
  };

  return (
    <div className="flex h-screen bg-telegram-dark">
      <ChatSidebar />
      <div className="flex flex-1">
        <ContactList onSelectContact={handleContactSelect} />
        {selectedContact ? (
          <>
            <ChatArea />
            <ContactInfo contactId={selectedContact} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;