// WebSocket 연결 관리 모듈

import { env } from "@/env";

export type WebSocketEventType =
  | "analysis_progress"
  | "monitoring_alert"
  | "bookmark_change"
  | "system_notification"
  | "news_update"
  | "exchange_rate_update"
  | "heartbeat";

export type WebSocketMessage = {
  type: WebSocketEventType;
  payload: any;
  timestamp: string;
  correlationId?: string;
};

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export type WebSocketConfig = {
  url: string;
  protocols?: string[];
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  enableLogging: boolean;
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private status: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private eventHandlers = new Map<
    WebSocketEventType,
    Set<(payload: any) => void>
  >();
  private statusHandlers = new Set<(status: ConnectionStatus) => void>();

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {
      url: "ws://localhost:3001/ws",
      protocols: [],
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      enableLogging: false,
      ...config,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.setStatus("connecting");
      this.log("WebSocket 연결 시도 중...");

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
          this.log("WebSocket 연결 성공");
          this.setStatus("connected");
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          this.log(`WebSocket 연결 종료: ${event.code} - ${event.reason}`);
          this.stopHeartbeat();

          if (event.code !== 1000) {
            // 정상 종료가 아닌 경우
            this.handleDisconnection();
          } else {
            this.setStatus("disconnected");
          }
        };

        this.ws.onerror = (error) => {
          this.log("WebSocket 오류:", error);
          this.setStatus("error");
          reject(new Error("WebSocket 연결 실패"));
        };
      } catch (error) {
        this.setStatus("error");
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.log("WebSocket 연결 종료 중...");

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "정상 종료");
      this.ws = null;
    }

    this.setStatus("disconnected");
  }

  send(
    type: WebSocketEventType,
    payload: any,
    correlationId?: string,
  ): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.log("WebSocket이 연결되지 않음");
      return false;
    }

    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      correlationId,
    };

    try {
      this.ws.send(JSON.stringify(message));
      this.log("메시지 전송:", message);
      return true;
    } catch (error) {
      this.log("메시지 전송 실패:", error);
      return false;
    }
  }

  subscribe(
    eventType: WebSocketEventType,
    handler: (payload: any) => void,
  ): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }

    this.eventHandlers.get(eventType)!.add(handler);

    // 구독 해제 함수 반환
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusHandlers.add(handler);

    // 구독 해제 함수 반환
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  isConnected(): boolean {
    return (
      this.status === "connected" && this.ws?.readyState === WebSocket.OPEN
    );
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      this.log("메시지 수신:", message);

      if (message.type === "heartbeat") {
        // 하트비트 응답
        this.send("heartbeat", { timestamp: Date.now() });
        return;
      }

      const handlers = this.eventHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message.payload);
          } catch (error) {
            this.log("이벤트 핸들러 오류:", error);
          }
        });
      }
    } catch (error) {
      this.log("메시지 파싱 오류:", error);
    }
  }

  private handleDisconnection(): void {
    this.setStatus("reconnecting");

    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.log(
        `재연결 시도 ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`,
      );

      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(() => {
          // 재연결 실패 시 다시 시도
          this.handleDisconnection();
        });
      }, this.config.reconnectInterval);
    } else {
      this.log("최대 재연결 시도 횟수 초과");
      this.setStatus("error");
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send("heartbeat", { timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.statusHandlers.forEach((handler) => {
        try {
          handler(status);
        } catch (error) {
          this.log("상태 핸들러 오류:", error);
        }
      });
    }
  }

  private log(message: string, ...args: any[]): void {
    if (this.config.enableLogging) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }
}

// 전역 WebSocket 인스턴스
export const websocketManager = new WebSocketManager({
  enableLogging: import.meta.env.DEV,
});

// React Hook 사용을 위한 유틸리티 함수들
export const connectWebSocket = () => websocketManager.connect();
export const disconnectWebSocket = () => websocketManager.disconnect();
export const subscribeToWebSocket =
  websocketManager.subscribe.bind(websocketManager);
export const sendWebSocketMessage =
  websocketManager.send.bind(websocketManager);
export const getWebSocketStatus = () => websocketManager.getStatus();
export const isWebSocketConnected = () => websocketManager.isConnected();
