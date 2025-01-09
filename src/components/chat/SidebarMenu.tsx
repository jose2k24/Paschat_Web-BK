import { Menu, User, Bookmark, Moon, Bug, Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const SidebarMenu = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 bg-[#1A1F2C] text-white border-gray-700"
      >
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => navigate("/saved-messages")}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Saved Messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => navigate("/contacts")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Contacts</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            Night Mode
          </span>
          <Switch />
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => navigate("/help")}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => navigate("/bug-report")}
        >
          <Bug className="mr-2 h-4 w-4" />
          <span>Report Bug</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 text-sm text-gray-400">
          PasChat Web A 10.9.34
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};