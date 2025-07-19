import type { ChatMessage } from "@/types/chat";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type ChatStoreState = {
  messages: ChatMessage[];
  message: string | null;
  isNewSession: boolean;
};

type ChatStoreActions = {
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (
    messageId: string,
    updater: (message: ChatMessage) => ChatMessage,
  ) => void;
  setMessage: (message: string | null) => void;
  setIsNew: (isNew: boolean) => void;
  clearPendingState: () => void;
  resetChat: () => void;
};

export const useChatStore = create<ChatStoreState & ChatStoreActions>(
  (set) => ({
    messages: [],
    message: null,
    isNewSession: false,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
    updateMessage: (messageId, updater) =>
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.messageId === messageId ? updater(msg) : msg,
        ),
      })),
    setMessage: (message) => set({ message }),
    setIsNew: (isNew) => set({ isNewSession: isNew }),
    clearPendingState: () => set({ message: null, isNewSession: false }),
    resetChat: () => set({ message: null, isNewSession: false, messages: [] }),
  }),
);

export const useChatState = () =>
  useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      message: state.message,
      isNewSession: state.isNewSession,
      setMessages: state.setMessages,
      addMessage: state.addMessage,
      updateMessage: state.updateMessage,
      setMessage: state.setMessage,
      setIsNew: state.setIsNew,
      clearPendingState: state.clearPendingState,
      resetChat: state.resetChat,
    })),
  );
