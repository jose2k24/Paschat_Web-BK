import { Menu, User, Bookmark, Moon, Sun, Bug, Settings, HelpCircle, LogOut } from "lucide-react";
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
    const savedTheme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode activated`);
  };

  const handleLogout = () => {
    // Add your logout logic here
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
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
          onClick={() => handleNavigation("/saved-messages")}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Saved Messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/contacts")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Contacts</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={() => handleNavigation("/settings")}
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
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};