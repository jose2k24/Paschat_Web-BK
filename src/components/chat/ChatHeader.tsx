import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMenu } from "./ChatMenu";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  onProfileClick: () => void;
}

export const ChatHeader = ({ onProfileClick }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
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
        className="flex items-center gap-3 cursor-pointer"
        onClick={onProfileClick}
      >
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
          M
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Muste</h2>
          <p className="text-sm text-gray-400">online</p>
        </div>
      </div>
      <ChatMenu />
    </div>
  );
};