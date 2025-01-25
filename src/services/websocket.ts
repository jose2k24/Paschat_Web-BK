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
      // Send the message immediately after connection
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
  }



  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();