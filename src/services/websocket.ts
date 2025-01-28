import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

class WebSocketService {
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private authToken: string | null = null;

  connect() {
    if (this.socket?.connected) return;
    
    if (!this.authToken) {
      console.error("No auth token found");
      return;
    }

    this.socket = io("https://vps.paschat.net/ws/chat", {
      query: { setOnlineStatus: "true" },
      auth: { token: this.authToken },
      transports: ['websocket'],
      secure: true,
      withCredentials: true
    });

    this.setupSocketEvents();
  }

  connectToAuth() {
    if (this.authSocket?.connected) return;
    
    this.authSocket = io("https://vps.paschat.net/ws/auth", {
      transports: ['websocket'],
      secure: true,
      withCredentials: true
    });

    this.setupAuthSocketEvents();
  }

  private setupAuthSocketEvents() {
    if (!this.authSocket) return;

    this.authSocket.on("connect", () => {
      console.log("Connected to auth websocket");
    });

    this.authSocket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });

    this.authSocket.on("response", (data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const subscribers = this.subscribers.get("auth");
        if (subscribers) {
          subscribers.forEach(callback => callback(parsedData));
        }
      } catch (error) {
        console.error("Error handling auth socket response:", error);
      }
    });
  }

  private setupSocketEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to chat websocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat websocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Failed to connect to chat server");
    });

    this.socket.on("response", (data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const subscribers = this.subscribers.get(parsedData.action);
        if (subscribers) {
          subscribers.forEach(callback => callback(parsedData));
        }
      } catch (error) {
        console.error("Error handling socket response:", error);
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "Chat error occurred");
    });
  }

  updateEventHandlers(namespace: string, event: string, callback: (data: any) => void) {
    const key = `${namespace}:${event}`;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)?.add(callback);

    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
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

  send(data: any) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      toast.error("Not connected to chat server");
      return;
    }
    this.socket.emit("request", JSON.stringify(data));
  }

  sendAuth(data: any) {
    if (!this.authSocket?.connected) {
      console.error("Auth socket not connected");
      toast.error("Not connected to auth server");
      return;
    }
    this.authSocket.emit("request", JSON.stringify(data));
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.authSocket) {
      this.authSocket.disconnect();
      this.authSocket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();