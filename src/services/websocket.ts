import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

class WebSocketService {
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private authToken: string | null = null;

  connect() {

    const authToken = localStorage.getItem("authToken");
    
    // Remove 'Bearer ' prefix if it exists for socket.io auth
    const token = authToken?.replace('Bearer ', '');
    
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

      // Emit the request after connecting
      this.authSocket?.emit(
        "request",
        JSON.stringify({
          action: "createLoginQrCode",
        })
      );
    });

    this.authSocket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });

    this.authSocket.on("response", (data) => {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const subscribers = this.subscribers.get("auth");
        if (subscribers) {
          subscribers.forEach((callback) => callback(parsedData));
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
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const subscribers = this.subscribers.get(parsedData.action);
        if (subscribers) {
          subscribers.forEach((callback) => callback(parsedData));
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

  setAuthToken(token: string) {
    this.authToken = token;

    // Automatically reconnect the socket with the new token
    if (this.socket) {
      this.disconnect();
      this.connect();
    }
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
