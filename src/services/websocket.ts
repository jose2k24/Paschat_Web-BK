import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface EventHandlers {
  [key: string]: {
    [key: string]: ((data: any) => void)[];
  };
}

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private authSocket: Socket | null = null;
  private connected: boolean = false;
  private eventHandlers: EventHandlers = {};
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private authToken: string | null = null;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.authToken = localStorage.getItem("authToken");
    // Attempt to connect if auth token exists
    if (this.authToken) {
      this.connect();
    }

    // Listen for storage events to handle token changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        if (event.newValue) {
          this.authToken = event.newValue;
          this.connect();
        } else {
          this.disconnect();
        }
      }
    });
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      this.connect();
    } else {
      this.disconnect();
    }
  }

  connectToAuth() {
    if (this.authSocket?.connected) return;

    this.authSocket = io("https://vps.paschat.net/ws/auth", {
      transports: ["websocket"],
      secure: true,
    });

    this.authSocket.on("connect", () => {
      console.log("Connected to auth websocket");
      this.authSocket?.emit("request", JSON.stringify({ action: "createLoginQrCode" }));
    });

    this.authSocket.on("disconnect", () => {
      console.log("Disconnected from auth websocket");
    });

    this.authSocket.on("response", (data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        this.notifySubscribers("auth", parsedData.action, parsedData);
      } catch (error) {
        console.error("Error parsing auth websocket response:", error);
      }
    });

    this.authSocket.on("error", (error) => {
      console.error("Auth WebSocket error:", error);
      toast.error("Authentication connection error occurred");
    });
  }

  connect(): Promise<void> {
    // Return existing connection promise if connection is in progress
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Return resolved promise if already connected
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        if (!this.authToken) {
          reject(new Error("No auth token found"));
          return;
        }

        this.socket = io("https://vps.paschat.net/ws/chat", {
          query: { setOnlineStatus: "true" },
          auth: { token: this.authToken },
          transports: ["websocket"],
          secure: true,
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
        });

        this.socket.on("connect", () => {
          console.log("Connected to chat websocket");
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log("Disconnected from chat websocket");
          this.connected = false;
          this.handleReconnect();
        });

        this.socket.on("connect_error", (error) => {
          console.error("Connection error:", error);
          this.connected = false;
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect();
          } else {
            reject(error);
          }
        });

        this.socket.on("response", (data) => {
          try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            this.notifySubscribers("chat", parsedData.action, parsedData);
          } catch (error) {
            console.error("Error parsing websocket response:", error);
          }
        });

        this.socket.on("error", (error) => {
          console.error("WebSocket error:", error);
          toast.error("Connection error occurred");
        });

      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        reject(error);
      }
    }).finally(() => {
      this.connectionPromise = null;
    });

    return this.connectionPromise;
  }

  private handleReconnect() {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      setTimeout(() => {
        this.connect().catch(console.error);
      }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000));
    } else {
      toast.error("Failed to reconnect to chat. Please refresh the page.");
    }
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

  async send(data: any) {
    if (!this.socket?.connected) {
      try {
        await this.connect();
      } catch (error) {
        console.error("Failed to connect:", error);
        throw new Error("Failed to connect to chat server");
      }
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
  }

  isConnected() {
    return this.connected;
  }
}

export const wsService = WebSocketService.getInstance();
