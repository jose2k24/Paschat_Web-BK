import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private wsUrl: string = "wss://api.paschat.net";
  private authToken: string | undefined;
  private eventHandlers: Map<string, Map<string, (data: any) => Promise<void>>> = new Map();

  constructor() {
    this.eventHandlers.set("auth", new Map());
    this.eventHandlers.set("chat", new Map());
  }

  private createConnection(namespace: string): Socket {
    const url = `${this.wsUrl}/${namespace}`;
    return this.authToken
      ? io(url, {
          auth: { token: this.authToken },
          transports: ['websocket'],
          withCredentials: true,
          extraHeaders: {
            "Access-Control-Allow-Origin": "*"
          }
        })
      : io(url, {
          transports: ['websocket'],
          withCredentials: true,
          extraHeaders: {
            "Access-Control-Allow-Origin": "*"
          }
        });
  }


  connectToAuth() {
    this.socket = this.createConnection("ws/auth");
    
    this.socket.on("connect", () => {
      console.log("Connected to auth websocket");
    });

    this.socket.on("response", async (data) => {
      const handlers = this.eventHandlers.get("auth")?.get("response");
      if (handlers) await handlers(data);
    });

    this.socket.on("error", async (data) => {
      const handlers = this.eventHandlers.get("auth")?.get("error");
      if (handlers) await handlers(data);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });
  }

  updateEventHandlers(
    namespace: "auth" | "chat",
    event: EventName,
    handler: EventHandler
  ) {
    const namespaceHandlers = this.eventHandlers.get(namespace);
    if (namespaceHandlers) {
      namespaceHandlers.set(event, handler);
    }
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
  }
}

export const wsService = new WebSocketService();