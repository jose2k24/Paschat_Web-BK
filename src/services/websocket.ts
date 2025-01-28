import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
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
      this.authToken = localStorage.getItem("authToken"); // Use the same token from localStorage
    }
  connect() {
    if (this.socket?.connected) return;

    this.socket = io("http://vps.paschat.net/ws", {
      auth: this.authToken ? { token: this.authToken } : undefined,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true,
      extraHeaders: {
            "Access-Control-Allow-Origin": "*"
      }
    });

    this.setupSocketEvents(this.socket);
  }

  connectToAuth() {
    if (this.authSocket?.connected) return;

    this.authSocket = io("http://vps.paschat.net/ws/auth", {
      auth: this.authToken ? { token: this.authToken } : undefined,
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true
    });

    this.authSocket.on("connect", () => {
      console.log("Connected to auth websocket");
      this.authSocket?.emit("request", JSON.stringify({
        action: "createLoginQrCode"
      }));
    });

    this.authSocket.on("response", (data) => {
      this.eventHandlers.auth.response(data);
    });

    this.setupSocketEvents(this.authSocket);
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
      return;
    }
    this.socket.emit("request", JSON.stringify(data));
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
    this.isConnected = false;
  }

  isSocketConnected(): boolean {
    return this.isConnected && (this.socket?.connected || this.authSocket?.connected) || false;
  }
}

export const wsService = new WebSocketService();