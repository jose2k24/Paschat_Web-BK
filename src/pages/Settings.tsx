import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
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
import GeneralSettings from "./settings/GeneralSettings";
import AnimationsSettings from "./settings/AnimationsSettings";
import NotificationsSettings from "./settings/NotificationsSettings";

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, label, onClick }) => (
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

  const handleSettingClick = (path: string) => {
    navigate(`/settings/${path}`);
  };

  return (
    <div className="flex h-screen bg-[#0F1621]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-700">
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
        
        <div className="py-2">
          <SettingItem
            icon={SettingsIcon}
            label="General Settings"
            onClick={() => handleSettingClick("general")}
          />
          <SettingItem
            icon={Zap}
            label="Animations and Performance"
            onClick={() => handleSettingClick("animations")}
          />
          <SettingItem
            icon={Bell}
            label="Notifications"
            onClick={() => handleSettingClick("notifications")}
          />
          <SettingItem
            icon={Database}
            label="Data and Storage"
            onClick={() => handleSettingClick("storage")}
          />
          <SettingItem
            icon={Lock}
            label="Privacy and Security"
            onClick={() => handleSettingClick("privacy")}
          />
          <SettingItem
            icon={FolderOpen}
            label="Chat Folders"
            onClick={() => handleSettingClick("folders")}
          />
          <SettingItem
            icon={Smartphone}
            label="Devices"
            onClick={() => handleSettingClick("devices")}
          />
          <SettingItem
            icon={Languages}
            label="Language"
            onClick={() => handleSettingClick("language")}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="animations" element={<AnimationsSettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          {/* Additional routes will be added for other settings */}
        </Routes>
      </div>
    </div>
  );
};

export default Settings;