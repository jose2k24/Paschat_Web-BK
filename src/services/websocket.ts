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
      transports: ["websocket"],
      secure: true,
      withCredentials: true,
    });

    this.setupSocketEvents();
  }

  connectToAuth() {
    if (this.authSocket?.connected) return;
    
    this.authSocket = io("https://vps.paschat.net/ws/auth", {
      transports: ["websocket"],
      secure: true,
      withCredentials: true,
    });

    this.setupAuthSocketEvents();
  }

  private setupAuthSocketEvents() {
    if (!this.authSocket) return;

    this.authSocket.on("connect", () => {
      console.log("Connected to auth websocket");
      this.sendAuth({ action: "createLoginQrCode" });
    });

    this.authSocket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });

    this.authSocket.on("response", (data) => {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        this.notifySubscribers("auth", parsedData);
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
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        this.notifySubscribers(parsedData.action, parsedData);
      } catch (error) {
        console.error("Error handling socket response:", error);
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "Chat error occurred");
    });
  }

  private notifySubscribers(event: string, data: any) {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach((callback) => callback(data));
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  updateEventHandlers(event: string, responseEvent: string, handler: (data: any) => void) {
    const unsubscribe = this.subscribe(responseEvent, handler);
    return unsubscribe;
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
    // Remove 'Bearer ' prefix if it exists
    this.authToken = token.replace('Bearer ', '');
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
    // Clear all subscribers
    this.subscribers.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();