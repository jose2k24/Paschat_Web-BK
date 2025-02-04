import React from "react";
import { Contact } from "@/types/chat";

interface ContactItemProps {
  contact: Contact;
  onClick: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onClick }) => {
  return (
    <button
      onClick={onClick}
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
  );
};