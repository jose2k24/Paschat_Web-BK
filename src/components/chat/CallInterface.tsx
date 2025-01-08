import React, { useEffect, useState } from "react";
import { X, Mic, Video, MonitorUp, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-white hover:bg-telegram-hover"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
            <img
              src="/telegram-logo.png"
              alt="Telegram"
              className="w-16 h-16"
            />
          </div>
          <h2 className="text-white text-xl font-medium">
            {type === "video" ? "Video Call" : "Voice Call"}
          </h2>
          <p className="text-white/80">
            {hasPermissions ? "Connected" : "requesting..."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
            onClick={() => {
              if (stream) {
                const audioTrack = stream.getAudioTracks()[0];
                audioTrack.enabled = !audioTrack.enabled;
                toast.info(audioTrack.enabled ? "Unmuted" : "Muted");
              }
            }}
          >
            <Mic className="h-6 w-6" />
          </Button>

          {type === "video" && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
              onClick={() => {
                if (stream) {
                  const videoTrack = stream.getVideoTracks()[0];
                  videoTrack.enabled = !videoTrack.enabled;
                  toast.info(videoTrack.enabled ? "Camera on" : "Camera off");
                }
              }}
            >
              <Video className="h-6 w-6" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
          >
            <MonitorUp className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full h-12 w-12"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};