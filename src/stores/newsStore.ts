import { create } from "zustand";

// 뉴스 아이템 타입
export type NewsItem = {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category:
    | "trade"
    | "regulation"
    | "policy"
    | "market"
    | "technology"
    | "general";
  tags: string[];
  source: string;
  author?: string;
  publishedAt: string;
  imageUrl?: string;
  url: string;
  isRead: boolean;
  priority: "low" | "normal" | "high";
  relevanceScore?: number;
};

// 뉴스 필터 옵션
export type NewsFilterOption =
  | "all"
  | "trade"
  | "regulation"
  | "policy"
  | "market"
  | "technology"
  | "general";

// 뉴스 상태 타입 정의 (데이터만 포함)
type NewsState = {
  // 뉴스 목록
  news: NewsItem[];

  // 필터 및 정렬
  selectedCategory: NewsFilterOption;
  searchQuery: string;
  sortBy: "date" | "relevance" | "priority";

  // 북마크된 뉴스 ID
  bookmarkedNewsIds: string[];

  // 상태
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  lastFetchedAt: string | null;
};

// 뉴스 액션 타입 정의 (함수들만 포함)
type NewsActions = {
  // 뉴스 데이터 관리
  setNews: (news: NewsItem[]) => void;
  addNews: (newsItems: NewsItem[]) => void;
  markAsRead: (newsId: string) => void;
  markAllAsRead: () => void;

  // 필터링 및 검색
  setFilter: (category: NewsFilterOption) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "date" | "relevance" | "priority") => void;

  // 북마크 관리
  toggleBookmark: (newsId: string) => void;
  isBookmarked: (newsId: string) => boolean;
  getBookmarkedNews: () => NewsItem[];

  // 상태 관리
  setLoading: (isLoading: boolean) => void;
  setLoadingMore: (isLoadingMore: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setLastFetchedAt: (timestamp: string) => void;

  // 필터링된 데이터
  getFilteredNews: () => NewsItem[];

  // 초기화
  reset: () => void;
};

// 전체 Store 타입 조합
type NewsStore = NewsState & NewsActions;

// 초기 상태
const initialState: NewsState = {
  news: [],
  selectedCategory: "all",
  searchQuery: "",
  sortBy: "date",
  bookmarkedNewsIds: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  lastFetchedAt: null,
};

// Zustand 스토어 생성
export const useNewsStore = create<NewsStore>()((set, get) => ({
  ...initialState,

  setNews: (news) => {
    set({
      news,
      lastFetchedAt: new Date().toISOString(),
    });
  },

  addNews: (newsItems) => {
    const { news } = get();
    const existingIds = new Set(news.map((item) => item.id));
    const newItems = newsItems.filter((item) => !existingIds.has(item.id));

    set({
      news: [...news, ...newItems],
      lastFetchedAt: new Date().toISOString(),
    });
  },

  markAsRead: (newsId) => {
    const { news } = get();
    set({
      news: news.map((item) =>
        item.id === newsId ? { ...item, isRead: true } : item,
      ),
    });
  },

  markAllAsRead: () => {
    const { news } = get();
    set({
      news: news.map((item) => ({ ...item, isRead: true })),
    });
  },

  setFilter: (category) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  toggleBookmark: (newsId) => {
    const { bookmarkedNewsIds } = get();
    if (bookmarkedNewsIds.includes(newsId)) {
      set({
        bookmarkedNewsIds: bookmarkedNewsIds.filter((id) => id !== newsId),
      });
    } else {
      set({
        bookmarkedNewsIds: [...bookmarkedNewsIds, newsId],
      });
    }
  },

  isBookmarked: (newsId) => {
    return get().bookmarkedNewsIds.includes(newsId);
  },

  getBookmarkedNews: () => {
    const { news, bookmarkedNewsIds } = get();
    return news.filter((item) => bookmarkedNewsIds.includes(item.id));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setLoadingMore: (isLoadingMore) => {
    set({ isLoadingMore });
  },

  setError: (error) => {
    set({ error });
  },

  setHasMore: (hasMore) => {
    set({ hasMore });
  },

  setLastFetchedAt: (timestamp) => {
    set({ lastFetchedAt: timestamp });
  },

  getFilteredNews: () => {
    const { news, selectedCategory, searchQuery, sortBy } = get();

    let filtered = news;

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // 검색 쿼리 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "relevance":
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        case "priority": {
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        default:
          return 0;
      }
    });

    return filtered;
  },

  reset: () => {
    set(initialState);
  },
}));
