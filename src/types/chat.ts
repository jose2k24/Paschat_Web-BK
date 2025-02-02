// Message interfaces for different operations
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

export interface SendMessageRequest {
  content: string;
  dataType: "text" | "image" | "video" | "document" | "audio";
  createdAt: string;
  roomId: number;
  recipientId: number;
}

export interface GetMessagesRequest {
  chatRoomId: number;
  timeZone: string;
  date: string;
}

// Chat room interfaces
export interface ChatRoom {
  roomId: number;
  roomType: "private" | "group" | "channel";
  createdAt: string;
  participants: Array<{
    id: number;
    phone: string;
  }>;
}

// Contact interfaces
export interface Contact {
  phone: string;
  profile: string | null;
  roomId: number | null;
}

// Community interfaces
export interface CommunityBase {
  id: number;
  type: "channel" | "group";
  visibility: "public" | "private";
  name: string;
  description: string;
  roomId: number;
  subscriberCount: number;
  ownerId: number;
  profile: string | null;
  createdAt: string;
  deleteFlag: boolean;
  invitationLink: string;
}

export interface Channel extends CommunityBase {
  type: "channel";
  permissions: {
    commenting: "all" | "admins";
    communitySharing: "all" | "admins";
  };
}

export interface Group extends CommunityBase {
  type: "group";
  permissions: {
    polls: "all" | "admins";
    pinning: "all" | "admins";
    messaging: "all" | "admins";
    prevMessage: boolean;
    mediaSharing: "all" | "admins";
    communitySharing: "all" | "admins";
  };
}

// Helper function to transform message formats
export function transformChatMessage(msg: Message): Message {
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
    received: msg.received,
    deleteFlag: msg.deleteFlag,
    callType: msg.callType
  };
}