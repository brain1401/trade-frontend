import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type ChatStoreState = {
  message: string | null;
  isNewSession: boolean;
};

type ChatStoreActions = {
  setMessage: (message: string | null) => void;
  setIsNew: (isNew: boolean) => void;
  clearChatState: () => void;
};

export const useChatStore = create<ChatStoreState & ChatStoreActions>(
  (set) => ({
    message: null,
    isNewSession: false,
    setMessage: (message) => set({ message }),
    setIsNew: (isNew) => set({ isNewSession: isNew }),
    clearChatState: () => set({ message: null, isNewSession: false }),
  }),
);

export const useChatState = () =>
  useChatStore(
    useShallow((state) => ({
      message: state.message,
      isNewSession: state.isNewSession,
      setMessage: state.setMessage,
      setIsNew: state.setIsNew,
      clearChatState: state.clearChatState,
    })),
  );
