import React, { useRef, useEffect } from "react";

interface VideoDisplayProps {
  stream: MediaStream | null;
  type: "video" | "voice";
}

export const VideoDisplay = ({ stream, type }: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (type === "voice" || !stream) {
    return (
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
        <img src="/telegram-logo.png" alt="Telegram" className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
    </div>
  );
};