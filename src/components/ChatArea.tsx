import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sent: boolean;
  time: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey there!",
    sent: false,
    time: "12:30",
  },
  {
    id: "2",
    content: "Hi! How are you?",
    sent: true,
    time: "12:31",
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
        hour: '2-digit', 
        minute: '2-digit'
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Current Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sent ? "message-sent" : "message-received"}`}
          >
            <p>{msg.content}</p>
            <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            className="bg-telegram-blue hover:bg-telegram-hover"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};