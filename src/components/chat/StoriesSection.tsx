import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Story {
  id: string;
  name: string;
  avatar?: string;
  hasUnseenStory: boolean;
}

const mockStories: Story[] = [
  { id: "1", name: "Your Story", hasUnseenStory: false },
  { id: "2", name: "John", hasUnseenStory: true },
  { id: "3", name: "Sarah", hasUnseenStory: true },
  { id: "4", name: "Mike", hasUnseenStory: true },
  { id: "5", name: "Emma", hasUnseenStory: true },
  { id: "6", name: "Alex", hasUnseenStory: true },
];

export const StoriesSection = () => {
  return (
    <div className="py-4 border-b border-gray-700">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 px-4">
          {mockStories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center space-y-1"
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
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};