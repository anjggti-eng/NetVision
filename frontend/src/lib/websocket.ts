import type { StreamUpdate } from '@/types';

type UpdateCallback = (data: StreamUpdate) => void;

export class MetricsWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onUpdate: UpdateCallback;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(onUpdate: UpdateCallback) {
    this.url = process.env.NEXT_PUBLIC_WS_URL
      ? `${process.env.NEXT_PUBLIC_WS_URL}/api/dashboard/ws`
      : `ws://localhost:8000/api/dashboard/ws`;
    this.onUpdate = onUpdate;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: StreamUpdate = JSON.parse(event.data);
          this.onUpdate(data);
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
