export interface Message {
  id: number;
  content: string;
  sender_id: number;
  chat_id: number;
  type: "text" | "image" | "video" | "document" | "audio";
  media_url?: string;
  is_edited: boolean;
  created_at: string;
  reactions?: {
    type: string;
    count: number;
    reacted_by: number[];
  }[];
  reply_to?: {
    message_id: number;
    content: string;
    sender_id: number;
  };
  forwarded_from?: {
    chat_id: number;
    message_id: number;
    sender_name: string;
  };
  call_type?: "audio" | "video" | null;
}

export interface CallState {
  isActive: boolean;
  type: "audio" | "video" | null;
  participantId: number | null;
  stream: MediaStream | null;
}

export interface ChatMessage {
  id: number;
  type: "text" | "image" | "video" | "document" | "audio";
  content: string;
  senderId: number;
  recipientId: number;
  roomId: number;
  replyTo: number | null;
  createdAt: string;
  read: boolean;
  received: boolean;
  deleteFlag: boolean;
  callType: "audio" | "video" | null;
}

export function transformChatMessage(msg: ChatMessage): Message {
  return {
    id: msg.id,
    content: msg.content,
    sender_id: msg.senderId,
    chat_id: msg.roomId,
    type: msg.type,
    is_edited: false,
    created_at: msg.createdAt,
    call_type: msg.callType
  };
}