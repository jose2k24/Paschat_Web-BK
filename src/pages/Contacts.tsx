import React from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";

const Contacts = () => {
  return (
    <div className="flex h-screen bg-telegram-dark">
      <ChatSidebar />
      <ChatArea />
    </div>
  );
};

export default Contacts;