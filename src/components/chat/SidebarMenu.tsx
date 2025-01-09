import { Menu, User, Bookmark, Moon, Sun, Bug, Settings, HelpCircle } from "lucide-react";
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
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initialize theme based on system preference
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      toast.success("Light mode activated");
    } else {
      document.documentElement.classList.add("dark");
      toast.success("Dark mode activated");
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleNavigation = (path: string, label: string) => {
    navigate(path);
    toast.success(`Navigated to ${label}`);
  };

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
          onClick={() => handleNavigation("/saved-messages", "Saved Messages")}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Saved Messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/contacts", "Contacts")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Contacts</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/settings", "Settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span className="flex items-center">
            {isDarkMode ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            {isDarkMode ? "Night Mode" : "Day Mode"}
          </span>
          <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/help", "Help")}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/bug-report", "Bug Report")}
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