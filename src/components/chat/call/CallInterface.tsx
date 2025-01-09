import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { VideoDisplay } from "./VideoDisplay";
import { CallControls } from "./CallControls";
import { CallHeader } from "./CallHeader";

interface CallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  type: "voice" | "video";
}

export const CallInterface = ({ isOpen, onClose, type }: CallInterfaceProps) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      requestPermissions();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const requestPermissions = async () => {
    try {
      const constraints = {
        audio: true,
        video: type === "video",
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermissions(true);
      toast.success(`${type === "video" ? "Camera" : "Microphone"} access granted`);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error(`Could not access ${type === "video" ? "camera" : "microphone"}`);
      onClose();
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-telegram-blue rounded-lg w-full max-w-lg p-6 relative">
        <CallHeader 
          onClose={onClose}
          type={type}
          hasPermissions={hasPermissions}
        />
        <div className="flex flex-col items-center gap-6 py-8">
          <VideoDisplay stream={stream} type={type} />
        </div>
        <CallControls
          stream={stream}
          type={type}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};