import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSearch = ({ value, onChange }: ChatSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search chats"
        className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};