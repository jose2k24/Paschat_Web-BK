import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Edit2, Sun, Moon, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const GeneralSettings = () => {
  const [name, setName] = React.useState("John Doe");
  const [bio, setBio] = React.useState("");
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success("Settings saved successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle image upload
      toast.success("Profile picture updated");
    }
  };

  return (
    <div className="min-h-full bg-[#17212B]">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="h-6 w-6" />
            General Settings
          </h2>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>

        <div className="space-y-8 bg-[#232E3C] rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1 bg-telegram-blue rounded-full cursor-pointer hover:bg-telegram-hover transition-colors"
              >
                <Camera className="h-4 w-4 text-white" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#17212B] text-white border-gray-700 focus:border-telegram-blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#17212B] text-white border-gray-700 focus:border-telegram-blue"
                  placeholder="Add a few words about yourself"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode" className="text-white">Theme</Label>
                <p className="text-sm text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Sun className="h-4 w-4" />
                <Switch
                  id="darkMode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-gray-700 text-gray-400 hover:text-white hover:bg-[#17212B]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-telegram-blue hover:bg-telegram-hover text-white"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;