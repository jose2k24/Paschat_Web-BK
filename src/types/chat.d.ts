export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  type: "text" | "image" | "video" | "document" | "audio";
  media_url?: string;
  is_edited: boolean;
  created_at: string;
  reactions?: {
    type: string;
    count: number;
    reacted_by: string[];
  }[];
  reply_to?: {
    message_id: string;
    content: string;
    sender_id: string;
  };
  forwarded_from?: {
    chat_id: string;
    message_id: string;
    sender_name: string;
  };
  call_type?: "audio" | "video" | null;
}

export interface CallState {
  isActive: boolean;
  type: "audio" | "video" | null;
  participantId: string | null;
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

// Transform function to convert ChatMessage to Message
export function transformChatMessage(msg: ChatMessage): Message {
  return {
    id: msg.id.toString(),
    content: msg.content,
    sender_id: msg.senderId.toString(),
    chat_id: msg.roomId.toString(),
    type: msg.type,
    is_edited: false,
    created_at: msg.createdAt,
    call_type: msg.callType
  };
}
