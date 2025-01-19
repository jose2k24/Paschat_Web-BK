import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const GeneralSettings = () => {
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">General Settings</h2>
        <p className="text-gray-400">Manage your profile and preferences</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch
            id="darkMode"
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;