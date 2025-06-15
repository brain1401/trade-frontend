import { create } from "zustand";

// 사용자 정보 타입 정의
type User = {
  id: string;
  name: string;
  email: string;
  company: string;
  businessNumber: string;
  membershipLevel: "BASIC" | "PREMIUM" | "ENTERPRISE";
  joinDate: string;
  avatar?: string;
};

// 인증 스토어 상태 타입 정의
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;

  // 액션들
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

// 목업 사용자 데이터 (로그인 상태로 가정)
const mockUser: User = {
  id: "user_12345",
  name: "김상현",
  email: "kim.sanghyun@example.com",
  company: "한국무역주식회사",
  businessNumber: "123-45-67890",
  membershipLevel: "PREMIUM",
  joinDate: "2023-03-15",
  avatar: undefined,
};

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태 - 로그인된 상태로 시작
  isAuthenticated: true,
  user: mockUser,

  // 로그인 액션
  login: (user: User) => set({ isAuthenticated: true, user }),

  // 로그아웃 액션
  logout: () => set({ isAuthenticated: false, user: null }),

  // 사용자 정보 업데이트 액션
  updateUser: (userData: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),
}));
