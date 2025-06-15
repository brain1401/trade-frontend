import { create } from "zustand";

// 간단한 뉴스 스토어 목업
export const useNewsStore = create(() => ({
  news: [],
  loading: false,
}));
