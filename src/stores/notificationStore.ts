import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "normal" | "high";
  category: "system" | "analysis" | "monitoring" | "trade";
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
};

// 알림 상태 타입 정의 (데이터만 포함)
type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isNotificationPanelOpen: boolean;
};

// 알림 액션 타입 정의 (함수들만 포함)
type NotificationActions = {
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  clearExpiredNotifications: () => void;
  toggleNotificationPanel: () => void;
  getNotificationsByCategory: (
    category: Notification["category"],
  ) => Notification[];
  getUnreadNotifications: () => Notification[];
};

// 전체 Store 타입 조합
type NotificationStore = NotificationState & NotificationActions;

const generateNotificationId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isNotificationPanelOpen: false,

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: generateNotificationId(),
          read: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100), // Keep only 100 most recent
          unreadCount: state.unreadCount + 1,
        }));

        // Auto-expire notifications after 24 hours if not specified
        if (!notification.expiresAt) {
          setTimeout(
            () => {
              get().removeNotification(notification.id);
            },
            24 * 60 * 60 * 1000,
          );
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      clearExpiredNotifications: () => {
        const now = new Date().toISOString();
        set((state) => {
          const validNotifications = state.notifications.filter(
            (n) => !n.expiresAt || n.expiresAt > now,
          );

          const removedUnreadCount = state.notifications.filter(
            (n) => n.expiresAt && n.expiresAt <= now && !n.read,
          ).length;

          return {
            notifications: validNotifications,
            unreadCount: Math.max(0, state.unreadCount - removedUnreadCount),
          };
        });
      },

      toggleNotificationPanel: () => {
        set((state) => ({
          isNotificationPanelOpen: !state.isNotificationPanelOpen,
        }));
      },

      getNotificationsByCategory: (category) => {
        return get().notifications.filter((n) => n.category === category);
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
      },
    }),
    {
      name: "notification-store",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);
