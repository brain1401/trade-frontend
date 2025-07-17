import { queryOptions } from "@tanstack/react-query";
import { chatHistoryApi } from "./api";
import type { ApiError } from "../common/ApiError";
import type { ChatHistory, PaginatedChatSessions } from "@/types/chat";

export const chatHistoryQueryKeys = {
  all: () => ["chatHistory"] as const,
  lists: () => [...chatHistoryQueryKeys.all(), "list"] as const,
  list: () => [...chatHistoryQueryKeys.lists()] as const,
  details: () => [...chatHistoryQueryKeys.all(), "detail"] as const,
  detail: (sessionId: string) =>
    [...chatHistoryQueryKeys.details(), sessionId] as const,
};

export const chatHistoryQueries = {
  list: () =>
    queryOptions<PaginatedChatSessions, ApiError>({
      queryKey: chatHistoryQueryKeys.list(),
      queryFn: () => chatHistoryApi.getChatHistories(),
    }),

  detail: (session_uuid: string, options?: { isNewChat?: boolean }) =>
    queryOptions<ChatHistory, ApiError>({
      queryKey: chatHistoryQueryKeys.detail(session_uuid),
      queryFn: () => chatHistoryApi.getChatHistory(session_uuid),
      enabled: !!session_uuid && !options?.isNewChat,
      // 세션이 새로 생성된 경우 잠시 후 다시 시도
      refetchInterval: options?.isNewChat ? 1000 : false,
      refetchIntervalInBackground: false,
    }),
};
