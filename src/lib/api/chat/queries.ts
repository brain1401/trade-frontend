import { queryOptions } from "@tanstack/react-query";
import type {
  ChatHistoryGetParams,
  ChatHistorySearchParams,
  ChatSessionDetail,
  PaginatedChatSessions,
  PaginatedChatSearchResults,
} from "../../../types/chat";
import { chatHistoryApi } from "./api";
import type { ApiError } from "../common/ApiError";
import type { ApiResponse } from "@/types/common";

export const chatHistoryQueryKeys = {
  all: () => ["chatHistory"] as const,
  lists: () => [...chatHistoryQueryKeys.all(), "list"] as const,
  list: () => [...chatHistoryQueryKeys.lists()] as const,
  details: () => [...chatHistoryQueryKeys.all(), "detail"] as const,
  detail: (sessionId: string) =>
    [...chatHistoryQueryKeys.details(), sessionId] as const,
};

export const chatHistoryQueries = {
  /** 채팅 세션 목록 조회를 위한 쿼리 옵션 */
  list: () =>
    queryOptions<PaginatedChatSessions, ApiError>({
      queryKey: chatHistoryQueryKeys.list(),
      queryFn: () => chatHistoryApi.getChatSessions(),
    }),

  /** 특정 채팅 세션 상세 조회를 위한 쿼리 옵션 */
  detail: (sessionId: string) =>
    queryOptions<ChatSessionDetail, ApiError>({
      queryKey: chatHistoryQueryKeys.detail(sessionId),
      queryFn: () => chatHistoryApi.getChatSession(sessionId),
      enabled: !!sessionId, // sessionId가 있을 때만 쿼리 실행
    }),
};
