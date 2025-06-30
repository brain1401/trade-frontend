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
  list: (params?: ChatHistoryGetParams) =>
    [...chatHistoryQueryKeys.lists(), params ?? {}] as const,

  details: () => [...chatHistoryQueryKeys.all(), "detail"] as const,
  detail: (sessionId: string) =>
    [...chatHistoryQueryKeys.details(), sessionId] as const,

  searches: () => [...chatHistoryQueryKeys.all(), "search"] as const,
  search: (params: ChatHistorySearchParams) =>
    [...chatHistoryQueryKeys.searches(), params] as const,
};

export const chatHistoryQueries = {
  list: (params?: ChatHistoryGetParams) =>
    queryOptions<ApiResponse<PaginatedChatSessions>, ApiError>({
      queryKey: chatHistoryQueryKeys.list(params),
      queryFn: () => chatHistoryApi.getChatSessions(params),
    }),
  detail: (sessionId: string) =>
    queryOptions<ApiResponse<ChatSessionDetail>, ApiError>({
      queryKey: chatHistoryQueryKeys.detail(sessionId),
      queryFn: () => chatHistoryApi.getChatSession(sessionId),
    }),
  search: (params: ChatHistorySearchParams) =>
    queryOptions<ApiResponse<PaginatedChatSearchResults>, ApiError>({
      queryKey: chatHistoryQueryKeys.search(params),
      queryFn: () => chatHistoryApi.searchChatHistory(params),
    }),
};
