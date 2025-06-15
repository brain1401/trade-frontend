import { create } from "zustand";
import type { PopularKeyword, RecentSearchItem, SearchResult } from "@/types";
import {
  mockPopularKeywords,
  mockRecentSearchItems,
  mockSearchResults,
} from "@/data/mock/search";

// 검색 관련 상태 타입 정의
type SearchState = {
  // 검색 쿼리 및 상태
  currentQuery: string;
  isSearching: boolean;

  // 검색 결과
  searchResults: SearchResult[];
  totalResults: number;

  // 인기 검색어
  popularKeywords: PopularKeyword[];

  // 최근 검색 항목
  recentSearchItems: RecentSearchItem[];

  // 검색 제안어
  searchSuggestions: string[];
  showSuggestions: boolean;

  // 검색 기록 (세션 내)
  searchHistory: string[];

  // 액션들
  setCurrentQuery: (query: string) => void;
  setSearching: (isSearching: boolean) => void;
  setSearchResults: (results: SearchResult[], total?: number) => void;
  addSearchHistory: (query: string) => void;
  addRecentSearchItem: (item: RecentSearchItem) => void;
  clearSearchResults: () => void;
  clearSearchHistory: () => void;

  // 검색 실행
  performSearch: (query: string) => Promise<void>;

  // 제안어 관련
  updateSuggestions: (query: string) => void;
  showSearchSuggestions: () => void;
  hideSearchSuggestions: () => void;

  // 인기 검색어 관련
  updatePopularKeywords: () => void;
  incrementKeywordCount: (keyword: string) => void;

  // 초기화
  loadInitialData: () => void;
  reset: () => void;
};

// 초기 상태
const initialState = {
  currentQuery: "",
  isSearching: false,
  searchResults: [],
  totalResults: 0,
  popularKeywords: [],
  recentSearchItems: [],
  searchSuggestions: [],
  showSuggestions: false,
  searchHistory: [],
};

// Zustand 스토어 생성
export const useSearchStore = create<SearchState>()((set, get) => ({
  ...initialState,

  setCurrentQuery: (query) => {
    set({ currentQuery: query });
  },

  setSearching: (isSearching) => {
    set({ isSearching });
  },

  setSearchResults: (results, total) => {
    set({
      searchResults: results,
      totalResults: total ?? results.length,
    });
  },

  addSearchHistory: (query) => {
    const { searchHistory } = get();
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)]; // 최대 10개 유지
      set({ searchHistory: newHistory });
    }
  },

  addRecentSearchItem: (item) => {
    const { recentSearchItems } = get();
    // 중복 제거 (같은 hscode가 있으면 제거)
    const filteredItems = recentSearchItems.filter(
      (existing) => existing.hscode !== item.hscode,
    );
    const newItems = [item, ...filteredItems.slice(0, 9)]; // 최대 10개 유지
    set({ recentSearchItems: newItems });
  },

  clearSearchResults: () => {
    set({ searchResults: [], totalResults: 0 });
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },

  performSearch: async (query) => {
    if (!query.trim()) {
      get().clearSearchResults();
      return;
    }

    set({ isSearching: true, currentQuery: query });

    try {
      // Mock 검색 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800));

      const lowercaseQuery = query.toLowerCase();
      const results = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(lowercaseQuery) ||
          result.description.toLowerCase().includes(lowercaseQuery),
      );

      // 관련성 점수로 정렬
      const sortedResults = results.sort(
        (a, b) => b.relevanceScore - a.relevanceScore,
      );

      set({
        searchResults: sortedResults,
        totalResults: sortedResults.length,
        isSearching: false,
      });

      // 검색 기록에 추가
      get().addSearchHistory(query);
    } catch (error) {
      console.error("Search failed:", error);
      set({
        searchResults: [],
        totalResults: 0,
        isSearching: false,
      });
    }
  },

  updateSuggestions: (query) => {
    if (!query.trim()) {
      set({ searchSuggestions: [], showSuggestions: false });
      return;
    }

    const { popularKeywords, searchHistory } = get();
    const lowercaseQuery = query.toLowerCase();

    // 인기 검색어에서 제안어 생성
    const keywordSuggestions = popularKeywords
      .filter((item) => item.keyword.toLowerCase().includes(lowercaseQuery))
      .map((item) => item.keyword)
      .slice(0, 3);

    // 검색 기록에서 제안어 생성
    const historySuggestions = searchHistory
      .filter((item) => item.toLowerCase().includes(lowercaseQuery))
      .slice(0, 2);

    const allSuggestions = [...keywordSuggestions, ...historySuggestions];
    const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 5);

    set({
      searchSuggestions: uniqueSuggestions,
      showSuggestions: uniqueSuggestions.length > 0,
    });
  },

  showSearchSuggestions: () => {
    set({ showSuggestions: true });
  },

  hideSearchSuggestions: () => {
    set({ showSuggestions: false });
  },

  updatePopularKeywords: () => {
    // Mock에서는 정적 데이터 사용
    set({ popularKeywords: mockPopularKeywords });
  },

  incrementKeywordCount: (keyword) => {
    const { popularKeywords } = get();
    const updatedKeywords = popularKeywords.map((item) =>
      item.keyword === keyword
        ? { ...item, searchCount: item.searchCount + 1 }
        : item,
    );
    set({ popularKeywords: updatedKeywords });
  },

  loadInitialData: () => {
    set({
      popularKeywords: mockPopularKeywords,
      recentSearchItems: mockRecentSearchItems,
    });
  },

  reset: () => {
    set(initialState);
  },
}));
