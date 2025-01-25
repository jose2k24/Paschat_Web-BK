import { io, Socket } from "socket.io-client";

type EventHandler = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private isConnected: boolean = false;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();

  constructor() {
    this.authToken = localStorage.getItem("authToken");
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem("authToken", token);
  }

  connect() {
    if (!this.socket) {
      this.socket = io("wss://api.paschat.net/ws", {
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
        const handlers = this.eventHandlers.get(data.action);
        if (handlers) {
          handlers.forEach(handler => handler(data.data));
        }
      });
    }
  }

  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);

    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(event);
        }
      }
    };
  }

  send(message: { action: string; data?: any }) {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit("message", message);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventHandlers.clear();
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();