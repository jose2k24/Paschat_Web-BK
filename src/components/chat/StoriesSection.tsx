import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { StoryViewer } from "../stories/StoryViewer";

interface Story {
  id: string;
  name: string;
  avatar?: string;
  hasUnseenStory: boolean;
  content: string;
  type: "image" | "video";
  timestamp: string;
}

const mockStories: Story[] = [
  { 
    id: "1", 
    name: "Your Story", 
    hasUnseenStory: false,
    content: "/placeholder.svg",
    type: "image",
    timestamp: "Just now"
  },
  { 
    id: "2", 
    name: "John", 
    hasUnseenStory: true,
    content: "/placeholder.svg",
    type: "video",
    timestamp: "2h ago"
  },
  { 
    id: "3", 
    name: "Sarah", 
    hasUnseenStory: true,
    content: "/placeholder.svg",
    type: "image",
    timestamp: "3h ago"
  },
  { 
    id: "4", 
    name: "Mike", 
    hasUnseenStory: true,
    content: "/placeholder.svg",
    type: "image",
    timestamp: "5h ago"
  },
  { 
    id: "5", 
    name: "Emma", 
    hasUnseenStory: true,
    content: "/placeholder.svg",
    type: "video",
    timestamp: "6h ago"
  },
  { 
    id: "6", 
    name: "Alex", 
    hasUnseenStory: true,
    content: "/placeholder.svg",
    type: "image",
    timestamp: "8h ago"
  },
];

export const StoriesSection = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsStoryViewerOpen(true);
  };

  return (
    <>
      <div className="py-4 border-b border-gray-700">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 px-4">
            {mockStories.map((story, index) => (
              <button
                key={story.id}
                className="flex flex-col items-center space-y-1"
                onClick={() => handleStoryClick(index)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  story.hasUnseenStory 
                    ? "bg-gradient-to-r from-pink-500 to-pink-500 p-[2px]" 
                    : "border-2 border-gray-700"
                }`}>
                  <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-white">
                    {story.name[0]}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{story.name}</span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={mockStories}
          initialStoryIndex={selectedStoryIndex}
          open={isStoryViewerOpen}
          onOpenChange={setIsStoryViewerOpen}
        />
      )}
    </>
  );
};