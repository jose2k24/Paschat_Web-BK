// Base message interface
export interface Message {
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

// Request interfaces
export interface GetMessagesRequest {
  chatRoomId: number;
  timeZone: string;
  date: string;
}

// Chat room interfaces
export interface ChatRoomParticipant {
  id: number;
  phone: string;
}

export interface ChatRoom {
  roomId: number;
  roomType: "private" | "group" | "channel";
  createdAt: string;
  participants: ChatRoomParticipant[];
}

// Contact interface
export interface Contact {
  phone: string;
  profile: string | null;
  roomId: number | null;
}

// Call state interface
export interface CallState {
  isActive: boolean;
  type: "audio" | "video" | null;
  participantId: number | null;
  stream: MediaStream | null;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
}

// Helper function to transform message formats
export function transformChatMessage(msg: any): Message {
  return {
    id: msg.id,
    type: msg.type,
    content: msg.content,
    senderId: msg.senderId,
    recipientId: msg.recipientId,
    roomId: msg.roomId,
    replyTo: msg.replyTo,
    createdAt: msg.createdAt,
    read: msg.read,
    received: msg.received || msg.recieved, // Handle both spellings from API
    deleteFlag: msg.deleteFlag,
    callType: msg.callType
  };
}