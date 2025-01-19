import { Routes, Route, NavLink } from "react-router-dom";
import { GeneralSettings } from "./settings/GeneralSettings";
import { AnimationsSettings } from "./settings/AnimationsSettings";
import { NotificationsSettings } from "./settings/NotificationsSettings";
import { DataStorageSettings } from "./settings/DataStorageSettings";
import { PrivacySecuritySettings } from "./settings/PrivacySecuritySettings";
import { ChatFoldersSettings } from "./settings/ChatFoldersSettings";
import { DevicesSettings } from "./settings/DevicesSettings";
import { LanguageSettings } from "./settings/LanguageSettings";

const Settings = () => {
  return (
    <div className="flex h-full bg-[#0F1621]">
      <div className="w-64 border-r border-gray-700">
        <nav className="p-4 space-y-2">
          {[
            { path: "general", label: "General" },
            { path: "animations", label: "Animations" },
            { path: "notifications", label: "Notifications" },
            { path: "data-storage", label: "Data and Storage" },
            { path: "privacy-security", label: "Privacy and Security" },
            { path: "chat-folders", label: "Chat Folders" },
            { path: "devices", label: "Devices" },
            { path: "language", label: "Language" },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 overflow-y-auto">
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