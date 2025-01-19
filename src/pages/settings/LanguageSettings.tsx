import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    toast.success("Language updated successfully");
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-6 w-6" />
        <h2 className="text-2xl font-semibold">Language Settings</h2>
      </div>
      
      <p className="text-gray-400 mb-6">
        Select your preferred language for the application interface.
      </p>

      <div className="grid gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
              selectedLanguage === language.code 
                ? "bg-telegram-blue" 
                : "bg-[#232E3C] hover:bg-[#2C3847]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <p className="font-medium">{language.name}</p>
                <p className="text-sm text-gray-400">{language.nativeName}</p>
              </div>
            </div>
            {selectedLanguage === language.code && (
              <Check className="h-5 w-5 text-white" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={() => toast.success("Settings saved successfully")}
          className="bg-telegram-blue hover:bg-telegram-hover"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};