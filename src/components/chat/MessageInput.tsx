import { Send, Link2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
}

export const MessageInput = ({ 
  message, 
  onMessageChange, 
  onSend,
  onFileClick 
}: MessageInputProps) => {
  const onEmojiSelect = (emoji: any) => {
    onMessageChange(message + emoji.native);
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={onFileClick}
        >
          <Link2 className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Picker data={data} onEmojiSelect={onEmojiSelect} />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={onSend}
          className="bg-telegram-blue hover:bg-telegram-hover text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};