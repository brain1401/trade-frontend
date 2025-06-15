import { create } from "zustand";
import type { TradeNews, HSCodeNews, NewsFilterOption } from "@/types";
import { mockTradeNews, mockHSCodeNews } from "@/data/mock/news";

// 뉴스 관련 상태 타입 정의
type NewsState = {
  // 무역 뉴스 데이터
  tradeNews: TradeNews[];
  hsCodeNews: HSCodeNews[];

  // 필터링 및 검색 상태
  currentFilter: NewsFilterOption;
  searchQuery: string;
  selectedHSCode?: string;

  // 북마크 상태
  bookmarkedNewsIds: Set<string>;

  // 로딩 상태
  isLoading: boolean;
  isLoadingMore: boolean;

  // 액션들
  setTradeNews: (news: TradeNews[]) => void;
  setHSCodeNews: (news: HSCodeNews[]) => void;
  setFilter: (filter: NewsFilterOption) => void;
  setSearchQuery: (query: string) => void;
  setSelectedHSCode: (hsCode?: string) => void;
  toggleBookmark: (newsId: string) => void;
  addBookmark: (newsId: string) => void;
  removeBookmark: (newsId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setLoadingMore: (isLoadingMore: boolean) => void;

  // 필터링된 데이터 가져오기
  getFilteredTradeNews: () => TradeNews[];
  getFilteredHSCodeNews: () => HSCodeNews[];
  getNewsByHSCode: (hsCode: string) => HSCodeNews[];
  getBookmarkedNews: () => HSCodeNews[];

  // 초기화
  loadInitialData: () => void;
  reset: () => void;
};

// 초기 상태
const initialState = {
  tradeNews: [],
  hsCodeNews: [],
  currentFilter: "latest" as NewsFilterOption,
  searchQuery: "",
  selectedHSCode: undefined,
  bookmarkedNewsIds: new Set<string>(),
  isLoading: false,
  isLoadingMore: false,
};

// Zustand 스토어 생성
export const useNewsStore = create<NewsState>()((set, get) => ({
  ...initialState,

  setTradeNews: (news) => {
    set({ tradeNews: news });
  },

  setHSCodeNews: (news) => {
    set({ hsCodeNews: news });
  },

  setFilter: (filter) => {
    set({ currentFilter: filter });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedHSCode: (hsCode) => {
    set({ selectedHSCode: hsCode });
  },

  toggleBookmark: (newsId) => {
    const { bookmarkedNewsIds } = get();
    const newBookmarks = new Set(bookmarkedNewsIds);

    if (newBookmarks.has(newsId)) {
      newBookmarks.delete(newsId);
    } else {
      newBookmarks.add(newsId);
    }

    set({ bookmarkedNewsIds: newBookmarks });

    // HSCodeNews의 bookmarked 상태도 업데이트
    const { hsCodeNews } = get();
    const updatedNews = hsCodeNews.map((news) =>
      news.uuid === newsId
        ? { ...news, bookmarked: newBookmarks.has(newsId) }
        : news,
    );
    set({ hsCodeNews: updatedNews });
  },

  addBookmark: (newsId) => {
    const { bookmarkedNewsIds } = get();
    const newBookmarks = new Set(bookmarkedNewsIds);
    newBookmarks.add(newsId);
    set({ bookmarkedNewsIds: newBookmarks });
  },

  removeBookmark: (newsId) => {
    const { bookmarkedNewsIds } = get();
    const newBookmarks = new Set(bookmarkedNewsIds);
    newBookmarks.delete(newsId);
    set({ bookmarkedNewsIds: newBookmarks });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setLoadingMore: (isLoadingMore) => {
    set({ isLoadingMore });
  },

  getFilteredTradeNews: () => {
    const { tradeNews, searchQuery } = get();

    if (!searchQuery.trim()) {
      return tradeNews;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    return tradeNews.filter(
      (news) =>
        news.title.toLowerCase().includes(lowercaseQuery) ||
        news.summary.toLowerCase().includes(lowercaseQuery),
    );
  },

  getFilteredHSCodeNews: () => {
    const { hsCodeNews, currentFilter, searchQuery, selectedHSCode } = get();
    let filteredNews = [...hsCodeNews];

    // 필터 적용
    if (currentFilter === "bookmarked") {
      filteredNews = filteredNews.filter((news) => news.bookmarked);
    }

    // HS Code 필터 적용
    if (selectedHSCode) {
      filteredNews = filteredNews.filter(
        (news) => news.hscode === selectedHSCode,
      );
    }

    // 검색어 필터 적용
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredNews = filteredNews.filter(
        (news) =>
          news.title.toLowerCase().includes(lowercaseQuery) ||
          news.summary.toLowerCase().includes(lowercaseQuery) ||
          news.hscode.includes(lowercaseQuery),
      );
    }

    // 날짜순 정렬 (최신순)
    return filteredNews.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  },

  getNewsByHSCode: (hsCode) => {
    const { hsCodeNews } = get();
    return hsCodeNews.filter((news) => news.hscode === hsCode);
  },

  getBookmarkedNews: () => {
    const { hsCodeNews } = get();
    return hsCodeNews.filter((news) => news.bookmarked);
  },

  loadInitialData: () => {
    set({ isLoading: true });

    // Mock 데이터 로드 (실제로는 API 호출)
    setTimeout(() => {
      const bookmarkedIds = new Set(
        mockHSCodeNews
          .filter((news) => news.bookmarked)
          .map((news) => news.uuid),
      );

      set({
        tradeNews: mockTradeNews,
        hsCodeNews: mockHSCodeNews,
        bookmarkedNewsIds: bookmarkedIds,
        isLoading: false,
      });
    }, 500); // 로딩 시뮬레이션
  },

  reset: () => {
    set(initialState);
  },
}));
