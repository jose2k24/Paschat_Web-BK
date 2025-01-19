import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationsSettings = () => {
  const [messageNotifs, setMessageNotifs] = React.useState(true);
  const [groupNotifs, setGroupNotifs] = React.useState(true);
  const [mentionNotifs, setMentionNotifs] = React.useState(true);

  const handleSave = () => {
    toast.success("Notification settings saved");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <p className="text-gray-400">Manage notification preferences</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="messageNotifs">Message Notifications</Label>
          <Switch
            id="messageNotifs"
            checked={messageNotifs}
            onCheckedChange={setMessageNotifs}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="groupNotifs">Group Notifications</Label>
          <Switch
            id="groupNotifs"
            checked={groupNotifs}
            onCheckedChange={setGroupNotifs}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="mentionNotifs">Mention Notifications</Label>
          <Switch
            id="mentionNotifs"
            checked={mentionNotifs}
            onCheckedChange={setMentionNotifs}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;