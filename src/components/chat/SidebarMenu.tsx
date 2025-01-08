import { Menu } from "lucide-react";
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
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          Saved Messages
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          Contacts
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          My Stories
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span>Night Mode</span>
          <Switch />
        </div>
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span>Animations</span>
          <Switch />
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          PasChat Features
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          Report a Bug
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
          Switch to K Version
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 text-sm text-gray-400">
          PasChat Web A 10.9.34
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};