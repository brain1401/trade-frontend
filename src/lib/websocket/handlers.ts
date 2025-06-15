// WebSocket 이벤트 핸들러 모듈

import { useAnalysisStore } from "@/stores/analysisStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useNewsStore } from "@/stores/newsStore";
import type { WebSocketEventType } from "./connection";

// 분석 진행 상황 업데이트 핸들러
export const handleAnalysisProgress = (payload: any) => {
  const { sessionId, status, progress, result, error } = payload;
  const analysisStore = useAnalysisStore.getState();

  if (error) {
    analysisStore.setError(sessionId, error);
    return;
  }

  if (status) {
    analysisStore.updateSessionStatus(sessionId, status);
  }

  if (progress) {
    analysisStore.updateProgress(sessionId, progress);
  }

  if (result) {
    analysisStore.setResult(sessionId, result);
  }
};

// 모니터링 알림 핸들러
export const handleMonitoringAlert = (payload: any) => {
  const { alert, priority, category } = payload;
  const notificationStore = useNotificationStore.getState();

  notificationStore.addNotification({
    id: alert.id,
    type: "monitoring",
    title: alert.title,
    message: alert.message,
    priority,
    category,
    timestamp: new Date().toISOString(),
    read: false,
  });

  // 브라우저 알림 표시
  if (priority === "high" || priority === "critical") {
    showBrowserNotification(alert.title, alert.message, priority);
  }
};

// 북마크 변경 알림 핸들러
export const handleBookmarkChange = (payload: any) => {
  const { bookmarkId, changeType, changes } = payload;
  const bookmarkStore = useBookmarkStore.getState();
  const notificationStore = useNotificationStore.getState();

  // 북마크 상태 업데이트
  if (changeType === "updated") {
    bookmarkStore.updateBookmark(bookmarkId, changes);
  } else if (changeType === "deleted") {
    bookmarkStore.removeBookmark(bookmarkId);
  }

  // 사용자에게 알림
  notificationStore.addNotification({
    id: `bookmark_${bookmarkId}_${Date.now()}`,
    type: "bookmark",
    title: "북마크 변경 알림",
    message: `모니터링 중인 항목에 변경사항이 발생했습니다.`,
    priority: changes.severity || "medium",
    timestamp: new Date().toISOString(),
    read: false,
    metadata: { bookmarkId, changeType, changes },
  });
};

// 시스템 알림 핸들러
export const handleSystemNotification = (payload: any) => {
  const { type, title, message, priority, metadata } = payload;
  const notificationStore = useNotificationStore.getState();

  notificationStore.addNotification({
    id: `system_${Date.now()}`,
    type: "system",
    title: title || "시스템 알림",
    message,
    priority: priority || "medium",
    timestamp: new Date().toISOString(),
    read: false,
    metadata,
  });

  // 중요한 시스템 알림은 브라우저 알림으로도 표시
  if (priority === "high" || priority === "critical") {
    showBrowserNotification(title || "시스템 알림", message, priority);
  }
};

// 뉴스 업데이트 핸들러
export const handleNewsUpdate = (payload: any) => {
  const { article, updateType } = payload;
  const newsStore = useNewsStore.getState();
  const notificationStore = useNotificationStore.getState();

  if (updateType === "new_article") {
    // 새 뉴스 기사 추가
    newsStore.addArticle(article);

    // 중요도가 높은 뉴스는 알림
    if (
      article.businessImpact === "high" ||
      article.businessImpact === "critical"
    ) {
      notificationStore.addNotification({
        id: `news_${article.id}`,
        type: "news",
        title: "중요 뉴스 업데이트",
        message: article.title,
        priority: article.businessImpact === "critical" ? "high" : "medium",
        timestamp: new Date().toISOString(),
        read: false,
        metadata: { articleId: article.id, category: article.category },
      });
    }
  } else if (updateType === "article_updated") {
    // 기존 뉴스 기사 업데이트
    newsStore.updateArticle(article.id, article);
  }
};

// 환율 업데이트 핸들러
export const handleExchangeRateUpdate = (payload: any) => {
  const { rates, significantChanges } = payload;
  const notificationStore = useNotificationStore.getState();

  // 환율 데이터는 별도 스토어나 캐시에 저장 (추후 구현)
  console.log("환율 업데이트:", rates);

  // 급격한 환율 변동이 있는 경우 알림
  if (significantChanges && significantChanges.length > 0) {
    significantChanges.forEach((change: any) => {
      notificationStore.addNotification({
        id: `exchange_${change.currency}_${Date.now()}`,
        type: "exchange_rate",
        title: "환율 급변 알림",
        message: `${change.currency} 환율이 ${change.changePercent}% 변동했습니다.`,
        priority: Math.abs(change.changePercent) > 5 ? "high" : "medium",
        timestamp: new Date().toISOString(),
        read: false,
        metadata: { currency: change.currency, change },
      });
    });
  }
};

// 브라우저 알림 표시 유틸리티
const showBrowserNotification = (
  title: string,
  message: string,
  priority: string,
) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const options: NotificationOptions = {
      body: message,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `trade-notification-${Date.now()}`,
      requireInteraction: priority === "critical",
      silent: false,
    };

    const notification = new Notification(title, options);

    // 5초 후 자동 닫기 (critical이 아닌 경우)
    if (priority !== "critical") {
      setTimeout(() => notification.close(), 5000);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// 모든 핸들러를 매핑하는 객체
export const eventHandlers: Record<WebSocketEventType, (payload: any) => void> =
  {
    analysis_progress: handleAnalysisProgress,
    monitoring_alert: handleMonitoringAlert,
    bookmark_change: handleBookmarkChange,
    system_notification: handleSystemNotification,
    news_update: handleNewsUpdate,
    exchange_rate_update: handleExchangeRateUpdate,
    heartbeat: () => {}, // 하트비트는 connection.ts에서 처리
  };

// WebSocket 핸들러 등록 함수
export const registerWebSocketHandlers = () => {
  const { subscribeToWebSocket } = require("./connection");

  Object.entries(eventHandlers).forEach(([eventType, handler]) => {
    if (eventType !== "heartbeat") {
      subscribeToWebSocket(eventType as WebSocketEventType, handler);
    }
  });
};
