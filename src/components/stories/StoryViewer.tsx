import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Heart, Send, Smile } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { toast } from "sonner";

interface Story {
  id: string;
  name: string;
  content: string;
  type: "image" | "video";
  timestamp: string;
  avatar?: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryViewer = ({ stories, initialStoryIndex, open, onOpenChange }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [message, setMessage] = useState("");
  const currentStory = stories[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success("Message sent!");
      setMessage("");
    }
  };

  const handleReaction = () => {
    toast.success("❤️ Reaction sent!");
  };

  const handleForward = () => {
    toast.success("Story shared!");
  };

  const onEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
        <div className="relative flex items-center justify-center">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="relative">
            <div className="bg-telegram-dark rounded-lg overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {currentStory.avatar ? (
                    <img
                      src={currentStory.avatar}
                      alt={currentStory.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white">{currentStory.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium">{currentStory.name}</h3>
                  <p className="text-sm text-gray-400">{currentStory.timestamp}</p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="ml-auto p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="relative aspect-[9/16] max-h-[80vh]">
                {currentStory.type === "video" ? (
                  <video
                    src={currentStory.content}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={currentStory.content}
                    alt={`Story by ${currentStory.name}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={handleReaction}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Send message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-gray-800 border-gray-700"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Picker data={data} onEmojiSelect={onEmojiSelect} theme="dark" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={handleForward}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};