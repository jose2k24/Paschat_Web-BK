import { useState } from "react";
import { Send, ArrowLeft, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfilePopup } from "./ProfilePopup";
import { ChatMenu } from "./chat/ChatMenu";

interface Message {
  id: string;
  content: string;
  sent: boolean;
  time: string;
  edited?: boolean;
  sender?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Thanks bro here's a link to the school management system : www.paschat.net",
    sent: false,
    time: "00:34",
    sender: "José"
  },
  {
    id: "2",
    content: "Muste i am debugging you're adding more stuff to the database 🤔",
    sent: false,
    time: "01:22"
  },
  {
    id: "3",
    content: "👍👍👍i will check it",
    sent: true,
    time: "10:11"
  }
];

export const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0F1621]">
      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setProfileOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
            M
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Muste</h2>
            <p className="text-sm text-gray-400">waiting for network</p>
          </div>
        </div>
        <ChatMenu />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
            Tuesday
          </span>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sent ? "message-sent" : "message-received"}`}
          >
            {msg.sender && (
              <span className="text-sm text-blue-400 block mb-1">{msg.sender}</span>
            )}
            <p className="break-words">{msg.content}</p>
            <div className="flex items-center gap-1 text-xs mt-1">
              <span className={msg.sent ? "text-gray-300" : "text-gray-500"}>
                {msg.time}
              </span>
              {msg.edited && (
                <span className={msg.sent ? "text-gray-300" : "text-gray-500"}>
                  • edited
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Link2 className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
          />
          <Button
            onClick={handleSend}
            className="bg-telegram-blue hover:bg-telegram-hover text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ProfilePopup open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};