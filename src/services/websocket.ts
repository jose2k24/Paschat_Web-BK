import { io, Socket } from "socket.io-client";

interface Message {
  id: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  content: string;
  senderId: number;
  recipientId: number;
  roomId: number;
  createdAt: string;
  read: boolean;
  received: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private isConnected: boolean = false;
  private eventHandlers: { [key: string]: { [key: string]: (data: any) => void } } = {
    auth: {
      response: async () => {},
    },
  };
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.authToken = localStorage.getItem("authToken");
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem("authToken", token);
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io("https://api.paschat.net/ws", {
      auth: this.authToken ? { token: this.authToken } : undefined,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true
    });

    this.socket.on("connect", () => {
      console.log("Connected to websocket");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from websocket");
      this.isConnected = false;
    });

    this.socket.on("message", (data: any) => {
      if (this.eventHandlers["message"]?.["response"]) {
        this.eventHandlers["message"]["response"](data);
      }
      this.notifySubscribers("message", data);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)?.add(callback);

    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }

  private notifySubscribers(event: string, data: any) {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }

  sendMessage(data: {
    content: string;
    dataType: 'text' | 'image' | 'video' | 'audio' | 'document';
    roomId: number;
    recipientId: number;
  }) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("message", {
      action: "sendMessage",
      data: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    });
  }

  getMessages(roomId: number) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("message", {
      action: "getMessages",
      data: {
        chatRoomId: roomId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date: new Date().toISOString().split('T')[0],
      },
    });
  }

  setTypingStatus(status: 'typing' | 'recording' | 'online') {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("message", {
      action: "setStatus",
      data: { status },
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();