export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  type: "text" | "image" | "video" | "document" | "audio";
  media_url?: string;
  is_edited: boolean;
  created_at: string;
  read?: boolean;
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

export interface ChatRoom {
  roomId: string;
  roomType: "private" | "group" | "channel";
  createdAt: string;
  participants: Array<{
    id: number;
    phone: string;
  }>;
}

export interface Contact {
  phone: string;
  name: string | null;
  profile: string | null;
  roomId: string | null;
}

export const transformChatMessage = (msg: ChatMessage): Message => {
  return {
    id: msg.id.toString(),
    content: msg.content,
    sender_id: msg.senderId.toString(),
    chat_id: msg.roomId.toString(),
    type: msg.type,
    is_edited: false,
    created_at: msg.createdAt,
    read: msg.read
  };
};