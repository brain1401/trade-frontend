import { create } from "zustand";

// Toast 메시지 타입
export type ToastMessage = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  duration?: number;
};

// UI 상태 타입 정의 (데이터만 포함)
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

  // Toast 상태
  toasts: ToastMessage[];
};

// UI 액션 타입 정의 (함수들만 포함)
type UIActions = {
  // 로딩 상태
  setLoading: (isLoading: boolean, message?: string) => void;
  setSearching: (isSearching: boolean, query?: string) => void;
  setSearchQuery: (query: string) => void;

  // 모달 관리
  openModal: (type: "search" | "user" | "settings") => void;
  closeModal: () => void;

  // 사이드바 관리
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // 에러 관리
  setError: (error: UIState["error"]) => void;
  clearError: () => void;

  // Toast 관리
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;

  // 초기화
  reset: () => void;
};

// 전체 Store 타입 조합
type UIStore = UIState & UIActions;

// 초기 상태
const initialState: UIState = {
  isLoading: false,
  loadingMessage: undefined,
  isSearching: false,
  searchQuery: "",
  isModalOpen: false,
  modalType: undefined,
  isSidebarOpen: false,
  error: undefined,
  toasts: [],
};

// Toast ID 생성 함수
const generateToastId = (): string => {
  return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Zustand 스토어 생성
export const useUIStore = create<UIStore>()((set, get) => ({
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

  addToast: (toast) => {
    const id = generateToastId();
    const newToast: ToastMessage = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 자동 제거 (기본 5초)
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  reset: () => {
    set(initialState);
  },
}));
