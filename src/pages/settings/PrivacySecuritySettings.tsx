import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const PrivacySecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [allowMessages, setAllowMessages] = useState("everyone");

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(`2FA ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Online Status</p>
              <p className="text-sm text-gray-500">Let others see when you're online</p>
            </div>
            <Switch checked={showOnline} onCheckedChange={setShowOnline} />
          </div>

          <div>
            <p className="font-medium mb-2">Who can message me?</p>
            <select 
              className="w-full px-3 py-2 border rounded-md"
              value={allowMessages}
              onChange={(e) => setAllowMessages(e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
          </div>

          <Button variant="outline" className="w-full">
            Active Sessions
          </Button>
        </div>
      </div>
    </div>
  );
};