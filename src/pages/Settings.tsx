import { Routes, Route, NavLink } from "react-router-dom";
import GeneralSettings from "./settings/GeneralSettings";
import AnimationsSettings from "./settings/AnimationsSettings";
import NotificationsSettings from "./settings/NotificationsSettings";
import { DataStorageSettings } from "./settings/DataStorageSettings";
import { PrivacySecuritySettings } from "./settings/PrivacySecuritySettings";
import { ChatFoldersSettings } from "./settings/ChatFoldersSettings";
import { DevicesSettings } from "./settings/DevicesSettings";
import { LanguageSettings } from "./settings/LanguageSettings";
import { Globe, Settings as SettingsIcon, Bell, HardDrive, Lock, Folders, Smartphone, Languages } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex h-full bg-[#17212B]">
      <div className="w-64 border-r border-gray-700 bg-[#17212B]">
        <nav className="p-4 space-y-2">
          {[
            { path: "general", label: "General", icon: SettingsIcon },
            { path: "animations", label: "Animations", icon: Globe },
            { path: "notifications", label: "Notifications", icon: Bell },
            { path: "data-storage", label: "Data and Storage", icon: HardDrive },
            { path: "privacy-security", label: "Privacy and Security", icon: Lock },
            { path: "chat-folders", label: "Chat Folders", icon: Folders },
            { path: "devices", label: "Devices", icon: Smartphone },
            { path: "language", label: "Language", icon: Languages },
          ].map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-telegram-blue text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#232E3C]"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-[#17212B] p-6">
        <Routes>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="animations" element={<AnimationsSettings />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="data-storage" element={<DataStorageSettings />} />
          <Route path="privacy-security" element={<PrivacySecuritySettings />} />
          <Route path="chat-folders" element={<ChatFoldersSettings />} />
          <Route path="devices" element={<DevicesSettings />} />
          <Route path="language" element={<LanguageSettings />} />
          <Route path="*" element={<GeneralSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;