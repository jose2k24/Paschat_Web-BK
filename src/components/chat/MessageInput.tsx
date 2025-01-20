import { Paperclip, Send, Smile, Image, Sticker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VoiceRecorder } from "./VoiceRecorder";
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-actions">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={onFileClick}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={onFileClick}
            >
              <Image className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send photo or video</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="input-wrapper">
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a message..."
          className="message-input"
        />
      </div>

      <div className="input-actions">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Sticker className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send Sticker</TooltipContent>
        </Tooltip>
        
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-0" align="end">
            <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
          </PopoverContent>
        </Popover>

        <VoiceRecorder />

        <Button
          onClick={onSend}
          className="bg-telegram-blue hover:bg-telegram-hover text-white"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};