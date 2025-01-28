import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

class WebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;
    
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found");
      return;
    }

    // Remove 'Bearer ' prefix if it exists for socket.io auth
    const token = authToken.replace('Bearer ', '');
  
    this.socket = io("https://vps.paschat.net/ws/chat", {
      query: { setOnlineStatus: "true" },
      auth: { token },
      transports: ['websocket'],
      secure: true,
      withCredentials: true
    });

    this.setupSocketEvents();
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

    // Handle incoming messages
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();