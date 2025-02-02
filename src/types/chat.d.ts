export interface Message {
  id: number;
  content: string;
  sender_id: number;
  chat_id: number;
  type: "text" | "image" | "video" | "document" | "audio";
  is_edited: boolean;
  created_at: string;
  read: boolean;
  received: boolean;
  delete_flag: boolean;
  report_flag: boolean;
  views: number;
  comments: any[] | null;
  reactions: any[] | null;
  call_type: "audio" | "video" | null;
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
  reportFlag: boolean;
  views: number;
  comments: any[] | null;
  reactions: any[] | null;
  callType: "audio" | "video" | null;
}

export interface ChatRoom {
  roomId: number;
  roomType: "private" | "group" | "channel";
  createdAt: string;
  participants: Array<{
    id: number;
    phone: string;
  }>;
}

export interface Contact {
  phone: string;
  profile: string | null;
  roomId: number | null;
}

export interface CallState {
  isActive: boolean;
  type: "audio" | "video" | null;
  participantId: number | null;
  stream: MediaStream | null;
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
    read: msg.read,
    received: msg.received,
    delete_flag: msg.deleteFlag,
    report_flag: msg.reportFlag,
    views: msg.views,
    comments: msg.comments,
    reactions: msg.reactions,
    call_type: msg.callType
  };
}