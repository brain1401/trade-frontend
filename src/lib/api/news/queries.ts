import { queryOptions } from "@tanstack/react-query";
import type { NewsDetail, NewsItem } from "./types";
import { newsApi } from "./api";
import type { ApiError } from "../common/ApiError";

export const newsQueryKeys = {
  all: () => ["news"] as const,
  lists: () => [...newsQueryKeys.all(), "list"] as const,
  list: () => [...newsQueryKeys.lists()] as const,
  details: () => [...newsQueryKeys.all(), "detail"] as const,
  detail: (id: number) => [...newsQueryKeys.details(), id] as const,
};

export const newsQueries = {
  list: () =>
    queryOptions<NewsItem[], ApiError>({
      queryKey: newsQueryKeys.list(),
      queryFn: newsApi.getNews,
    }),
  detail: (id: number) =>
    queryOptions<NewsDetail, ApiError>({
      queryKey: newsQueryKeys.detail(id),
      queryFn: () => newsApi.getNewsById(id),
    }),
};
