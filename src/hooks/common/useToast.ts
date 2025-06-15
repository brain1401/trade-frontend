import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { ReactNode } from "react";

type ToastVariant = "default" | "destructive";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: ReactNode;
};

type ToastState = {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const useToastStore = create<ToastState>()(
  subscribeWithSelector((set, get) => ({
    toasts: [],

    toast: (props) => {
      const id = Date.now().toString();
      const toast: Toast = { id, ...props };

      set((state) => ({
        toasts: [...state.toasts, toast],
      }));

      // 5초 후 자동 제거
      setTimeout(() => {
        get().dismiss(id);
      }, 5000);
    },

    dismiss: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    },

    clear: () => {
      set({ toasts: [] });
    },
  })),
);

export const useToast = () => {
  const { toast, dismiss, clear, toasts } = useToastStore();

  return {
    toast,
    dismiss,
    clear,
    toasts,
  };
};
