import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useToast } from "@/hooks/common/useToast";

// WebSocket 메시지 타입 정의
type WebSocketMessage = {
  type: string;
  payload: any;
  timestamp?: string;
};

// 알림 타입 정의
type NotificationPayload = {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "normal" | "high";
  category: "system" | "analysis" | "monitoring" | "trade";
  data?: Record<string, any>;
  timestamp?: string;
  expiresAt?: string;
};

// 분석 진행 상황 타입 정의
type AnalysisProgressPayload = {
  sessionId: string;
  percentage: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
};

// 북마크 업데이트 타입 정의
type BookmarkUpdatePayload = {
  bookmarkId: string;
  changes: Record<string, any>;
  type: "status_change" | "content_update" | "delete";
};

// 메시지 타입별 페이로드 매핑
type MessagePayloadMap = {
  NOTIFICATION: NotificationPayload;
  ANALYSIS_PROGRESS: AnalysisProgressPayload;
  BOOKMARK_UPDATE: BookmarkUpdatePayload;
};

// WebSocket manager class for connection handling
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers = new Map<string, Function[]>();

  connect(userId: string, token: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws"}?userId=${userId}&token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;

        // Send authentication and subscription messages
        this.send({
          type: "AUTH",
          payload: { userId, token },
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.attemptReconnect(userId, token);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach((handler: Function) => {
      try {
        handler(message.payload);
      } catch (error) {
        console.error(
          `Error in WebSocket message handler for ${message.type}:`,
          error,
        );
      }
    });
  }

  subscribe<T extends keyof MessagePayloadMap>(
    messageType: T,
    handler: (payload: MessagePayloadMap[T]) => void,
  ): () => void;
  subscribe(messageType: string, handler: (payload: any) => void): () => void;
  subscribe(messageType: string, handler: Function) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private attemptReconnect(userId: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
        console.log(
          `Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
        );
        this.connect(userId, token);
      }, delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// 전역 WebSocket 매니저 인스턴스
const wsManager = new WebSocketManager();

export const useWebSocket = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { toast } = useToast();

  // 함수들을 useCallback으로 memoize하여 참조 안정화
  const handleNotification = useCallback(
    (notification: NotificationPayload) => {
      addNotification(notification);

      // Show toast for important notifications
      if (notification.priority === "high") {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === "error" ? "destructive" : "default",
        });
      }
    },
    [addNotification, toast],
  );

  const handleAnalysisProgress = useCallback(
    (progress: AnalysisProgressPayload) => {
      // Handle analysis progress updates
      console.log("Analysis progress update:", progress);
    },
    [],
  );

  const handleBookmarkUpdate = useCallback((update: BookmarkUpdatePayload) => {
    console.log("Bookmark update:", update);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      return;
    }

    // Connect to WebSocket
    wsManager.connect(user.id, token);

    // Set up message handlers for different types of real-time updates
    const unsubscribeNotification = wsManager.subscribe(
      "NOTIFICATION",
      handleNotification,
    );
    const unsubscribeAnalysis = wsManager.subscribe(
      "ANALYSIS_PROGRESS",
      handleAnalysisProgress,
    );
    const unsubscribeBookmark = wsManager.subscribe(
      "BOOKMARK_UPDATE",
      handleBookmarkUpdate,
    );

    // Cleanup on unmount or auth change
    return () => {
      unsubscribeNotification();
      unsubscribeAnalysis();
      unsubscribeBookmark();
      wsManager.disconnect();
    };
  }, [
    isAuthenticated,
    user,
    token,
    handleNotification,
    handleAnalysisProgress,
    handleBookmarkUpdate,
  ]);
  // user 객체 포함 - user.id 접근 위해 필요하지만 authStore에서 안정적 참조 유지 필요

  const sendMessage = useCallback((message: any) => {
    wsManager.send(message);
  }, []);

  return {
    sendMessage,
    isConnected: wsManager.isConnected,
    subscribe: wsManager.subscribe.bind(wsManager),
  };
};
