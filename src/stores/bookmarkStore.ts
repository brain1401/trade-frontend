import { create } from "zustand";
import { persist } from "zustand/middleware";

// 북마크 타입 정의
export type BookmarkType =
  | "규제"
  | "HS Code"
  | "통계"
  | "뉴스"
  | "화물추적"
  | "분석결과";
export type BookmarkCategory =
  | "환경/에너지"
  | "전자/통신"
  | "무역통계"
  | "운송/물류"
  | "기타";

export type Bookmark = {
  id: string;
  title: string;
  type: BookmarkType;
  category: BookmarkCategory;
  url?: string;
  summary: string;
  tags: string[];
  isMonitored: boolean;
  createdAt: string;
  updatedAt: string;
  // 추가 메타데이터
  metadata?: {
    hsCode?: string;
    cargoNumber?: string;
    analysisResultId?: string;
    regulationId?: string;
    customData?: Record<string, any>;
  };
};

// 모니터링 설정
export type MonitoringSettings = {
  id: string;
  bookmarkId: string;
  alertTypes: Array<"update" | "change" | "deadline" | "news">;
  frequency: "realtime" | "daily" | "weekly";
  isEnabled: boolean;
  lastChecked?: string;
  nextCheck?: string;
};

// 알림 히스토리
export type AlertHistory = {
  id: string;
  bookmarkId: string;
  type: "update" | "change" | "deadline" | "news";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: "low" | "medium" | "high";
};

// 북마크 스토어 상태
type BookmarkState = {
  // 북마크 관리
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;

  // 모니터링 설정
  monitoringSettings: MonitoringSettings[];

  // 알림 히스토리
  alertHistory: AlertHistory[];
  unreadAlertCount: number;

  // 필터 및 검색 상태
  filters: {
    type: BookmarkType | "전체";
    category: BookmarkCategory | "전체";
    isMonitored: boolean | null;
    searchQuery: string;
  };

  // 정렬 설정
  sortBy: "createdAt" | "updatedAt" | "title" | "type";
  sortOrder: "asc" | "desc";

  // 액션 메서드
  // 북마크 관리
  addBookmark: (
    bookmark: Omit<Bookmark, "id" | "createdAt" | "updatedAt">,
  ) => string;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
  replaceBookmark: (tempId: string, bookmark: Bookmark) => void;
  toggleBookmarkMonitoring: (id: string) => void;

  // 북마크 조회
  getBookmark: (id: string) => Bookmark | undefined;
  getBookmarksByType: (type: BookmarkType) => Bookmark[];
  getMonitoredBookmarks: () => Bookmark[];

  // 모니터링 설정 관리
  addMonitoringSettings: (settings: Omit<MonitoringSettings, "id">) => void;
  updateMonitoringSettings: (
    id: string,
    updates: Partial<MonitoringSettings>,
  ) => void;
  removeMonitoringSettings: (bookmarkId: string) => void;
  toggleMonitoring: (bookmarkId: string) => void;

  // 알림 관리
  addAlert: (alert: Omit<AlertHistory, "id" | "timestamp">) => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  clearAlertHistory: () => void;

  // 필터 및 검색
  setFilter: (key: keyof BookmarkState["filters"], value: any) => void;
  clearFilters: () => void;
  setSorting: (
    sortBy: BookmarkState["sortBy"],
    sortOrder: BookmarkState["sortOrder"],
  ) => void;

  // 대량 작업
  setBookmarks: (bookmarks: Bookmark[]) => void;
  importBookmarks: (bookmarks: Bookmark[]) => void;
  exportBookmarks: () => Bookmark[];

  // 상태 관리
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 통계
  getBookmarkStats: () => {
    total: number;
    byType: Record<BookmarkType, number>;
    monitored: number;
    unreadAlerts: number;
  };
};

// 유틸리티 함수
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const createBookmark = (
  data: Omit<Bookmark, "id" | "createdAt" | "updatedAt">,
): Bookmark => ({
  ...data,
  id: generateId(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// 북마크 스토어 생성
export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      bookmarks: [],
      isLoading: false,
      error: null,
      monitoringSettings: [],
      alertHistory: [],
      unreadAlertCount: 0,

      filters: {
        type: "전체",
        category: "전체",
        isMonitored: null,
        searchQuery: "",
      },

      sortBy: "createdAt",
      sortOrder: "desc",

      // 북마크 관리 액션
      addBookmark: (bookmarkData) => {
        const bookmark = createBookmark(bookmarkData);
        set((state) => ({
          bookmarks: [bookmark, ...state.bookmarks],
          error: null,
        }));
        return bookmark.id;
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark.id === id
              ? { ...bookmark, ...updates, updatedAt: new Date().toISOString() }
              : bookmark,
          ),
        }));
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
          monitoringSettings: state.monitoringSettings.filter(
            (settings) => settings.bookmarkId !== id,
          ),
          alertHistory: state.alertHistory.filter(
            (alert) => alert.bookmarkId !== id,
          ),
        }));
      },

      replaceBookmark: (tempId, bookmark) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === tempId ? bookmark : b,
          ),
        }));
      },

      toggleBookmarkMonitoring: (id) => {
        const state = get();
        const bookmark = state.bookmarks.find((b) => b.id === id);
        if (bookmark) {
          get().updateBookmark(id, { isMonitored: !bookmark.isMonitored });

          if (!bookmark.isMonitored) {
            // 모니터링 활성화 시 기본 설정 추가
            get().addMonitoringSettings({
              bookmarkId: id,
              alertTypes: ["update", "change"],
              frequency: "daily",
              isEnabled: true,
            });
          } else {
            // 모니터링 비활성화 시 설정 제거
            get().removeMonitoringSettings(id);
          }
        }
      },

      // 북마크 조회
      getBookmark: (id) => {
        return get().bookmarks.find((bookmark) => bookmark.id === id);
      },

      getBookmarksByType: (type) => {
        return get().bookmarks.filter((bookmark) => bookmark.type === type);
      },

      getMonitoredBookmarks: () => {
        return get().bookmarks.filter((bookmark) => bookmark.isMonitored);
      },

      // 모니터링 설정 관리
      addMonitoringSettings: (settingsData) => {
        const settings: MonitoringSettings = {
          ...settingsData,
          id: generateId(),
        };
        set((state) => ({
          monitoringSettings: [...state.monitoringSettings, settings],
        }));
      },

      updateMonitoringSettings: (id, updates) => {
        set((state) => ({
          monitoringSettings: state.monitoringSettings.map((settings) =>
            settings.id === id ? { ...settings, ...updates } : settings,
          ),
        }));
      },

      removeMonitoringSettings: (bookmarkId) => {
        set((state) => ({
          monitoringSettings: state.monitoringSettings.filter(
            (settings) => settings.bookmarkId !== bookmarkId,
          ),
        }));
      },

      toggleMonitoring: (bookmarkId) => {
        const state = get();
        const settings = state.monitoringSettings.find(
          (s) => s.bookmarkId === bookmarkId,
        );
        if (settings) {
          get().updateMonitoringSettings(settings.id, {
            isEnabled: !settings.isEnabled,
          });
        }
      },

      // 알림 관리
      addAlert: (alertData) => {
        const alert: AlertHistory = {
          ...alertData,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          alertHistory: [alert, ...state.alertHistory],
          unreadAlertCount: state.unreadAlertCount + 1,
        }));
      },

      markAlertAsRead: (id) => {
        set((state) => ({
          alertHistory: state.alertHistory.map((alert) =>
            alert.id === id && !alert.isRead
              ? { ...alert, isRead: true }
              : alert,
          ),
          unreadAlertCount: Math.max(0, state.unreadAlertCount - 1),
        }));
      },

      markAllAlertsAsRead: () => {
        set((state) => ({
          alertHistory: state.alertHistory.map((alert) => ({
            ...alert,
            isRead: true,
          })),
          unreadAlertCount: 0,
        }));
      },

      clearAlertHistory: () => {
        set({
          alertHistory: [],
          unreadAlertCount: 0,
        });
      },

      // 필터 및 검색
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            type: "전체",
            category: "전체",
            isMonitored: null,
            searchQuery: "",
          },
        });
      },

      setSorting: (sortBy, sortOrder) => {
        set({ sortBy, sortOrder });
      },

      // 대량 작업
      setBookmarks: (bookmarks) => {
        set({ bookmarks, error: null });
      },

      importBookmarks: (newBookmarks) => {
        set((state) => ({
          bookmarks: [...state.bookmarks, ...newBookmarks],
          error: null,
        }));
      },

      exportBookmarks: () => {
        return get().bookmarks;
      },

      // 상태 관리
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      // 통계
      getBookmarkStats: () => {
        const state = get();
        const byType: Record<BookmarkType, number> = {
          규제: 0,
          "HS Code": 0,
          통계: 0,
          뉴스: 0,
          화물추적: 0,
          분석결과: 0,
        };

        state.bookmarks.forEach((bookmark) => {
          byType[bookmark.type]++;
        });

        return {
          total: state.bookmarks.length,
          byType,
          monitored: state.bookmarks.filter((b) => b.isMonitored).length,
          unreadAlerts: state.unreadAlertCount,
        };
      },
    }),
    {
      name: "bookmark-store",
      // 세션 스토리지를 사용하여 탭 간 공유하지 않음
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      // 필터나 정렬 상태는 persist하지 않음
      partialize: (state) => ({
        ...state,
        // 세션 전용 상태는 초기값으로 리셋
        filters: {
          type: "전체" as const,
          category: "전체" as const,
          isMonitored: null,
          searchQuery: "",
        },
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
        isLoading: false,
        error: null,
      }),
    },
  ),
);
