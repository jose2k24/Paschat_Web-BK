import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSearch = ({ value, onChange }: ChatSearchProps) => {
  return (
    <div className="relative mt-4">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search chats or people"
        className="pl-9 pr-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-telegram-blue focus-visible:border-telegram-blue transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};