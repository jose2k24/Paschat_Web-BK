import { ArrowLeft, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMenu } from "./ChatMenu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CallInterface } from "./CallInterface";

interface ChatHeaderProps {
  onProfileClick: () => void;
  title?: string;
  subtitle?: string;
}

export const ChatHeader = ({ onProfileClick, title = "User", subtitle = "online" }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);

  const handleVoiceCall = () => {
    setCallType("voice");
  };

  const handleVideoCall = () => {
    setCallType("video");
  };

  return (
    <>
      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-gray-700"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div 
          className="flex items-center gap-3 cursor-pointer flex-1"
          onClick={onProfileClick}
        >
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
            {title[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
            onClick={handleVoiceCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
          </Button>
          <ChatMenu />
        </div>
      </div>

      <CallInterface
        isOpen={callType !== null}
        onClose={() => setCallType(null)}
        type={callType || "voice"}
      />
    </>
  );
};