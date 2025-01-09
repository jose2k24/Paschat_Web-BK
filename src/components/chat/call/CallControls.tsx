import React from "react";
import { Mic, Video, MonitorUp, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CallControlsProps {
  stream: MediaStream | null;
  type: "voice" | "video";
  onEndCall: () => void;
}

export const CallControls = ({ stream, type, onEndCall }: CallControlsProps) => {
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      toast.info(audioTrack.enabled ? "Unmuted" : "Muted");
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      toast.info(videoTrack.enabled ? "Camera on" : "Camera off");
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      <Button
        variant="ghost"
        size="icon"
        className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
        onClick={toggleAudio}
      >
        <Mic className="h-6 w-6" />
      </Button>

      {type === "video" && (
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
          onClick={toggleVideo}
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
        onClick={onEndCall}
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
};