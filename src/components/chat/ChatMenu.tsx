import {
  MoreVertical,
  Edit,
  Video,
  Mic,
  CheckSquare,
  Gift,
  UserMinus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const ChatMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-gray-800 text-white border-gray-700">
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <Video className="mr-2 h-4 w-4" />
          <span>Video Call</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <Mic className="mr-2 h-4 w-4" />
          <span>Mute...</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <CheckSquare className="mr-2 h-4 w-4" />
          <span>Select messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <Gift className="mr-2 h-4 w-4" />
          <span>Send a Gift</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Block user</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500 hover:bg-gray-700 hover:text-red-500 focus:bg-gray-700 focus:text-red-500 cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete chat</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};