import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface EventHandlers {
  [namespace: string]: {
    [event: string]: (data: any) => void;
  };
}

class WebSocketService {
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
  private authToken: string | null = null;
  private isConnected: boolean = false;
  private eventHandlers: EventHandlers = {};

  connectToAuth() {
    if (this.authSocket?.connected) return;

    this.authSocket = io("https://vps.paschat.net/ws/auth", {
      auth: this.authToken ? { token: this.authToken } : undefined,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
      }
    });

    this.authSocket.on("connect", () => {
      console.log("Connected to auth websocket");
      this.authSocket?.emit("request", JSON.stringify({
        action: "createLoginQrCode"
      }));
    });

    this.authSocket.on("response", (data) => {
      if (this.eventHandlers.auth?.response) {
        this.eventHandlers.auth.response(data);
      }
    });

    this.setupSocketEvents(this.authSocket);
  }

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

    this.setupSocketEvents(this.socket);
  }

  private setupSocketEvents(socket: Socket) {
    socket.on("connect", () => {
      console.log("Connected to websocket");
      this.isConnected = true;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from websocket");
      this.isConnected = false;
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Connection error occurred");
    });
  }

  updateEventHandlers(
    namespace: "auth",
    event: "response",
    handler: (data: any) => void
  ) {
    if (!this.eventHandlers[namespace]) {
      this.eventHandlers[namespace] = {};
    }
    this.eventHandlers[namespace][event] = handler;
    
    // Return unsubscribe function
    return () => {
      if (this.eventHandlers[namespace]) {
        delete this.eventHandlers[namespace][event];
      }
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
    this.eventHandlers = {};
    this.isConnected = false;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();