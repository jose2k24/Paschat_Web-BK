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

// WebSocket message request interface
export interface SendMessageRequest {
  action: "sendMessage";
  data: {
    content: string;
    dataType: "text" | "image" | "video" | "document" | "audio";
    createdAt: string;
    roomId: number;
    senderId: number;
    recipientId: number;
  };
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

// Media content interface
export interface MediaContent {
  mediaUrl: string;
  fileSize: string;
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

// Helper function to determine file type
export function getMessageType(mimeType: string): Message["type"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.startsWith("application/") ||
    mimeType.startsWith("text/")
  ) return "document";
  return "text";
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}${sizes[i]}`;
}