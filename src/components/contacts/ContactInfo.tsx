import React from "react";
import { Phone, AtSign, Bell, Image, FileText, Music, Mic, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ContactInfoProps {
  contactId: string;
}

export const ContactInfo = ({ contactId }: ContactInfoProps) => {
  // Mock data - in a real app, fetch this based on contactId
  const contact = {
    name: "Muste",
    username: "@Dech_u",
    phone: "+251 91 067 5097",
    lastSeen: "last seen recently",
    avatar: "/lovable-uploads/6c179206-23a9-4879-b4d4-0b5c8c3e552a.png"
  };

  return (
    <div className="w-[350px] bg-[#0F1621] border-l border-gray-800 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-white font-medium">User Info</h2>
        <button className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <h3 className="text-white text-xl font-medium mb-1">{contact.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{contact.lastSeen}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="h-5 w-5" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <AtSign className="h-5 w-5" />
              <span>{contact.username}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-4">
            {[
              { icon: Image, label: "Media", count: 12 },
              { icon: FileText, label: "Files", count: 5 },
              { icon: Music, label: "Music", count: 3 },
              { icon: Mic, label: "Voice", count: 8 },
              { icon: Image, label: "Links", count: 15 }
            ].map((item, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                <span className="text-xs">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};