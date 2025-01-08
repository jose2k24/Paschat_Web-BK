export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  type: "text" | "image" | "video" | "document";
  media_url?: string;
  is_edited: boolean;
  created_at: string;
}