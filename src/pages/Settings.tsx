import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  ArrowLeft,
  Zap,
  Bell,
  Database,
  Lock,
  FolderOpen,
  Smartphone,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsItem = ({ icon: Icon, label, onClick }: { 
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center px-4 py-3 hover:bg-gray-700/50 transition-colors"
  >
    <Icon className="h-5 w-5 mr-3 text-gray-400" />
    <span className="text-white">{label}</span>
  </button>
);

const Settings = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettingClick = (setting: string) => {
    // Here you would typically navigate to the specific setting page
    toast.info(`Navigating to ${setting}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1621]">
      <div className="flex items-center p-4 border-b border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold text-white">Settings</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          <SettingsItem
            icon={SettingsIcon}
            label="General Settings"
            onClick={() => handleSettingClick("General Settings")}
          />
          <SettingsItem
            icon={Zap}
            label="Animations and Performance"
            onClick={() => handleSettingClick("Animations and Performance")}
          />
          <SettingsItem
            icon={Bell}
            label="Notifications"
            onClick={() => handleSettingClick("Notifications")}
          />
          <SettingsItem
            icon={Database}
            label="Data and Storage"
            onClick={() => handleSettingClick("Data and Storage")}
          />
          <SettingsItem
            icon={Lock}
            label="Privacy and Security"
            onClick={() => handleSettingClick("Privacy and Security")}
          />
          <SettingsItem
            icon={FolderOpen}
            label="Chat Folders"
            onClick={() => handleSettingClick("Chat Folders")}
          />
          <SettingsItem
            icon={Smartphone}
            label="Devices"
            onClick={() => handleSettingClick("Devices")}
          />
          <SettingsItem
            icon={Languages}
            label="Language"
            onClick={() => handleSettingClick("Language")}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;