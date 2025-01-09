import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallHeaderProps {
  onClose: () => void;
  type: "voice" | "video";
  hasPermissions: boolean;
}

export const CallHeader = ({ onClose, type, hasPermissions }: CallHeaderProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-white hover:bg-telegram-hover"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center gap-2 py-4">
        <h2 className="text-white text-xl font-medium">
          {type === "video" ? "Video Call" : "Voice Call"}
        </h2>
        <p className="text-white/80">
          {hasPermissions ? "Connected" : "requesting..."}
        </p>
      </div>
    </>
  );
};