import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatTabsProps {
  activeTab: "all" | "group" | "channel";
  onTabChange: (tab: "all" | "group" | "channel") => void;
}

export const ChatTabs = ({ activeTab, onTabChange }: ChatTabsProps) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-gray-800 text-white border-gray-700">
          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
            New Group
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
            Contacts
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-1 gap-4">
        <button
          onClick={() => onTabChange("all")}
          className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-pink-500 text-pink-500"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          All Chats
        </button>
        <button
          onClick={() => onTabChange("group")}
          className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "group"
              ? "border-pink-500 text-pink-500"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Group
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-pink-500 text-white rounded-full">
            2
          </span>
        </button>
        <button
          onClick={() => onTabChange("channel")}
          className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "channel"
              ? "border-pink-500 text-pink-500"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Channel
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-pink-500 text-white rounded-full">
            2
          </span>
        </button>
      </div>
    </div>
  );
};