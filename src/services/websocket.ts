import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface EventHandlers {
  [key: string]: {
    [key: string]: ((data: any) => void)[];
  };
}

class WebSocketService {
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
  private authToken: string | null = null;
  private connected: boolean = false;
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
      this.notifySubscribers("auth", "response", data);
    });

    this.setupSocketEvents(this.authSocket);
  }

  connect() {
    if (this.socket?.connected) return;
    
    this.authToken = localStorage.getItem("authToken");
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
      this.connected = true;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from websocket");
      this.connected = false;
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Connection error occurred");
    });
  }

  subscribe(namespace: string, event: string, handler: (data: any) => void) {
    if (!this.eventHandlers[namespace]) {
      this.eventHandlers[namespace] = {};
    }
    if (!this.eventHandlers[namespace][event]) {
      this.eventHandlers[namespace][event] = [];
    }
    this.eventHandlers[namespace][event].push(handler);
    
    return () => {
      const handlers = this.eventHandlers[namespace][event];
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(namespace: string, event: string, data: any) {
    if (this.eventHandlers[namespace]?.[event]) {
      this.eventHandlers[namespace][event].forEach(handler => handler(data));
    }
  }

  send(data: any) {
    if (!this.socket) {
      this.connect(); // Try to connect if socket doesn't exist
    }
    
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      toast.error("Connection error: Please try again");
      return Promise.reject(new Error("Socket not connected"));
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket!.emit("request", JSON.stringify(data));
        resolve(true);
      } catch (error) {
        console.error("Error sending message:", error);
        reject(error);
      }
    });
  }

  setAuthToken(token: string) {
    this.authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    if (token) {
      localStorage.setItem("authToken", this.authToken);
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
    this.eventHandlers = {};
    this.connected = false;
    this.authToken = null;
  }

  isConnected() {
    return this.connected;
  }
}

export const wsService = new WebSocketService();
