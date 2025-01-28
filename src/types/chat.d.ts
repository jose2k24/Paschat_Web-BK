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

export interface Chat {
  id: string;
  type: "private" | "group" | "channel";
  name: string;
  description?: string;
  avatar_url?: string;
  last_message?: Message;
  unread_count: number;
  members_count?: number;
  is_admin?: boolean;
  is_owner?: boolean;
  permissions?: {
    can_send_messages: boolean;
    can_send_media: boolean;
    can_add_members: boolean;
    can_pin_messages: boolean;
    can_change_info: boolean;
  };
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
  participants: {
    id: number;
    phone: string;
  }[];
}
