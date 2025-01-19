import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Bell, 
  BellOff, 
  Volume2, 
  MessageSquare, 
  AtSign,
  Users,
  Check
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NotificationsSettings = () => {
  const [messageNotifs, setMessageNotifs] = React.useState(true);
  const [groupNotifs, setGroupNotifs] = React.useState(true);
  const [mentionNotifs, setMentionNotifs] = React.useState(true);
  const [sound, setSound] = React.useState("default");

  const handleSave = () => {
    toast.success("Notification settings saved", {
      icon: <Check className="h-4 w-4 text-green-500" />,
    });
  };

  const handleMuteAll = () => {
    setMessageNotifs(false);
    setGroupNotifs(false);
    setMentionNotifs(false);
    toast.success("All notifications muted");
  };

  const playSound = () => {
    // Play notification sound preview
    toast.success("Playing notification sound");
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-gray-400">Manage notification preferences</p>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleMuteAll}
          className="text-red-500 hover:text-red-600"
        >
          <BellOff className="h-4 w-4" />
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="messages" className="border-gray-700">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Message Notifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="messageNotifs">Private Messages</Label>
                <Switch
                  id="messageNotifs"
                  checked={messageNotifs}
                  onCheckedChange={setMessageNotifs}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="groups" className="border-gray-700">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Group Notifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="groupNotifs">Group Messages</Label>
                <Switch
                  id="groupNotifs"
                  checked={groupNotifs}
                  onCheckedChange={setGroupNotifs}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mentions" className="border-gray-700">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              <span>Mention Notifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mentionNotifs">When Mentioned</Label>
                <Switch
                  id="mentionNotifs"
                  checked={mentionNotifs}
                  onCheckedChange={setMentionNotifs}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notification Sound</Label>
            <p className="text-sm text-gray-400">Choose your notification sound</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={playSound}
            className="text-gray-400 hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <Select value={sound} onValueChange={setSound}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sound" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;