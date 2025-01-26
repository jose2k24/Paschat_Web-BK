import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.authToken = localStorage.getItem("authToken");
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem("authToken", token);
    
    // Reconnect with new token if socket exists
    if (this.socket) {
      this.socket.disconnect();
      this.connect();
    }
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
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from websocket");
    });

    this.socket.on("message", (data: any) => {
      this.notifySubscribers("message", data);
    });

    this.socket.on("auth", (data: any) => {
      this.notifySubscribers("auth", data);
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

  send(data: any) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("message", data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();