import { create } from "zustand";

// UI 관련 상태 타입 정의
type UIState = {
  // 로딩 상태 관리
  isLoading: boolean;
  loadingMessage?: string;

  // 검색 상태
  isSearching: boolean;
  searchQuery: string;

  // 모달 상태
  isModalOpen: boolean;
  modalType?: "search" | "user" | "settings";

  // 사이드바 상태 (모바일)
  isSidebarOpen: boolean;

  // 에러 상태
  error?: {
    message: string;
    type: "network" | "api" | "validation" | "unknown";
  };

  // 액션들
  setLoading: (isLoading: boolean, message?: string) => void;
  setSearching: (isSearching: boolean, query?: string) => void;
  setSearchQuery: (query: string) => void;
  openModal: (type: "search" | "user" | "settings") => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setError: (error: UIState["error"]) => void;
  clearError: () => void;
  reset: () => void;
};

// 초기 상태
const initialState = {
  isLoading: false,
  loadingMessage: undefined,
  isSearching: false,
  searchQuery: "",
  isModalOpen: false,
  modalType: undefined,
  isSidebarOpen: false,
  error: undefined,
};

// Zustand 스토어 생성
export const useUIStore = create<UIState>()((set, _get) => ({
  ...initialState,

  setLoading: (isLoading, message) => {
    set({ isLoading, loadingMessage: message });
  },

  setSearching: (isSearching, query) => {
    set((state) => ({
      isSearching,
      searchQuery: query ?? state.searchQuery,
    }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  openModal: (type) => {
    set({ isModalOpen: true, modalType: type });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalType: undefined });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: undefined });
  },

  reset: () => {
    set(initialState);
  },
}));
