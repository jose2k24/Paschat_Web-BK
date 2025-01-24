import { toast } from "sonner";

export interface WebSocketMessage {
  action: string;
  data?: any;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private authToken: string | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  connect() {
    try {
      this.ws = new WebSocket("wss://api.paschat.net/ws");
      
      this.ws.onopen = () => {
        console.log("WebSocket Connected");
        if (this.authToken) {
          this.send({
            action: "authenticate",
            data: { token: this.authToken }
          });
        }
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection error occurred");
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.attemptReconnect();
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      toast.error("Failed to establish connection");
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  subscribe(action: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(action)) {
      this.messageHandlers.set(action, []);
    }
    this.messageHandlers.get(action)?.push(handler);

    return () => {
      const handlers = this.messageHandlers.get(action);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.action);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      toast.error("Connection not established");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = WebSocketService.getInstance();