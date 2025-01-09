import React, { useState, useRef } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        const audioUrl = URL.createObjectURL(audioBlob);
        // Here you would typically upload the audio file
        console.log("Audio recorded:", audioUrl);
        toast.success("Voice message recorded");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`text-gray-400 hover:text-white hover:bg-gray-700 ${
        isRecording ? 'animate-pulse text-red-500' : ''
      }`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
};