import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    toast.success("Language updated successfully");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Language</h3>
        
        <div className="space-y-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 ${
                selectedLanguage === language.code ? "bg-gray-100" : ""
              }`}
            >
              <div>
                <p className="font-medium">{language.name}</p>
                <p className="text-sm text-gray-500">{language.nativeName}</p>
              </div>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};