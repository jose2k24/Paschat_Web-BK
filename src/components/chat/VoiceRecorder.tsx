import React, { useState, useRef, useEffect } from "react";
import { Mic, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.info("Recording started...", {
        position: "bottom-center",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone", {
        position: "bottom-center",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendRecording = () => {
    if (audioUrl) {
      // Here you would typically upload the audio file
      toast.success("Voice message sent");
      setAudioUrl(null);
      chunksRef.current = [];
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    chunksRef.current = [];
    toast.info("Recording deleted");
  };

  return (
    <div className="relative flex items-center gap-2">
      {isRecording && (
        <span className="text-red-500 animate-pulse mr-2">
          {formatTime(recordingTime)}
        </span>
      )}
      {audioUrl ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-500/20"
            onClick={deleteRecording}
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500 hover:bg-green-500/20"
            onClick={sendRecording}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
};