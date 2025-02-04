import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContactInfo } from "@/components/contacts/ContactInfo";
import { ContactList } from "@/components/contacts/ContactList";
import { ChatArea } from "@/components/ChatArea";
import { Button } from "@/components/ui/button";

const Contacts = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContactSelect = (chatId: string) => {
    setSelectedContact(chatId);
  };

  const handleBack = () => {
    navigate("/chat");
  };

  return (
    <div className="flex h-screen bg-telegram-dark">
      <div className="flex flex-1">
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4 flex items-center gap-2 border-b border-gray-800">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-white font-medium">Contacts</h2>
          </div>
          <ContactList onSelectContact={handleContactSelect} />
        </div>
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