import { useState } from "react";
import { Send, MoreVertical, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sent: boolean;
  time: string;
  edited?: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Just ask - I will do everything for you.",
    sent: false,
    time: "10:03 AM",
  },
  {
    id: "2",
    content: "I always keep my promises",
    sent: false,
    time: "12:34 AM",
  },
  {
    id: "3",
    content: "Well, yes, of course - you very rarely keep your promises.",
    sent: true,
    time: "12:06 AM",
  },
  {
    id: "4",
    content: "And you lie very often.",
    sent: true,
    time: "12:06 AM",
  },
  {
    id: "5",
    content: "Where is my flamethrower?",
    sent: true,
    time: "1:50 PM",
    edited: true,
  },
];

export const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
            E
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Elon</h2>
            <p className="text-sm text-gray-400">online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-gray-700"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
            21 January
          </span>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sent ? "message-sent" : "message-received"}`}
          >
            <p>{msg.content}</p>
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
          <Input
            placeholder="Write a message..."
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
    </div>
  );
};