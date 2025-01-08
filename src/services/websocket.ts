type MessageHandler = (message: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

  connect(userId: string) {
    this.ws = new WebSocket(`wss://your-websocket-server.com/${userId}`);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(userId), 1000);
    };
  }

  subscribe(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const websocketService = new WebSocketService();