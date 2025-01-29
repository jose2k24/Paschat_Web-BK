import { useState, useEffect } from 'react';
import { wsService } from '@/services/websocket';
import { toast } from 'sonner';
import { CallState } from '@/types/chat';

export const useCall = (chatId: string) => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: null,
    participantId: null,
    stream: null,
  });

  useEffect(() => {
    const handleIncomingCall = (data: any) => {
      if (data.chatId === chatId) {
        setCallState({
          isActive: true,
          type: data.callType,
          participantId: data.senderId,
          stream: null,
        });
      }
    };

    const unsubscribe = wsService.subscribe("chat", "incomingCall", handleIncomingCall);
    return () => unsubscribe();
  }, [chatId]);

  const initiateCall = async (type: "audio" | "video") => {
    try {
      const constraints = {
        audio: true,
        video: type === "video",
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      wsService.send({
        action: "initiateCall",
        data: {
          callType: type,
          chatId,
        },
      });

      setCallState({
        isActive: true,
        type,
        participantId: null,
        stream,
      });

      toast.success(`${type} call initiated`);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error(`Could not access ${type === "video" ? "camera" : "microphone"}`);
    }
  };

  const endCall = () => {
    if (callState.stream) {
      callState.stream.getTracks().forEach(track => track.stop());
    }

    wsService.send({
      action: "endCall",
      data: {
        chatId,
      },
    });

    setCallState({
      isActive: false,
      type: null,
      participantId: null,
      stream: null,
    });

    toast.info("Call ended");
  };

  return {
    callState,
    initiateCall,
    endCall,
  };
};