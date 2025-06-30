import { chatHistoryQueries } from "./queries";
import { createQueryHook } from "../common/createQuery";

// --- Queries ---

export const useGetChatSessions = createQueryHook(chatHistoryQueries.list);

export const useGetChatSession = createQueryHook(
  chatHistoryQueries.detail,
  (sessionId) => ({
    enabled: !!sessionId,
  }),
);

export const useSearchChatHistory = createQueryHook(chatHistoryQueries.search);
