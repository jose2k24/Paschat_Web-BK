import { io, Socket } from "socket.io-client";

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

  connectToAuth() {
    this.socket = io("https://api.paschat.net/ws/auth", {
      auth: this.authToken ? { token: this.authToken } : undefined,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true
    });

    this.socket.on("connect", () => {
      console.log("Connected to auth websocket");
      this.socket?.emit("request", JSON.stringify({
        action: "createLoginQrCode"
      }));
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    this.socket.on("response", (data) => {
      this.eventHandlers.auth.response(data);
      this.notifySubscribers("auth", data);
    });
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

  updateEventHandlers(
    namespace: "auth" | "message",
    event: "response",
    handler: (data: any) => void
  ) {
    if (!this.eventHandlers[namespace]) {
      this.eventHandlers[namespace] = {};
    }
    this.eventHandlers[namespace][event] = handler;
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
      this.isConnected = false;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();