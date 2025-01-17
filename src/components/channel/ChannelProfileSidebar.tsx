import { Users, Bell, Share2, Flag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChannelProfileSidebarProps {
  channel: {
    id: string;
    name: string;
    subscribersCount: number;
    description?: string;
    isOwner: boolean;
  };
}

export const ChannelProfileSidebar = ({ channel }: ChannelProfileSidebarProps) => {
  return (
    <div className="w-[300px] border-l border-gray-700 bg-[#0F1621] flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-medium mb-3">
              {channel.name[0]}
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{channel.name}</h2>
            <p className="text-sm text-gray-400">{channel.subscribersCount} subscribers</p>
          </div>

          {channel.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-300">{channel.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300">
              <Users className="h-5 w-5" />
              Subscribers
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300">
              <Bell className="h-5 w-5" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300">
              <Share2 className="h-5 w-5" />
              Share Link
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-300">
              <Flag className="h-5 w-5" />
              Report
            </Button>
          </div>

          <Separator className="my-4 bg-gray-700" />

          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            Unsubscribe
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};