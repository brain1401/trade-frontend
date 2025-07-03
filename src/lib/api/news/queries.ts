import { queryOptions } from "@tanstack/react-query";
import { newsApi } from "./api";
import type { ApiError } from "../common/ApiError";
import type { News } from "./types";

export const newsQueryKeys = {
  all: () => ["news"] as const,
  list: (params: { offset: number; limit: number }) =>
    [...newsQueryKeys.all(), "list", params] as const,
};

export const newsQueries = {
  list: (params: { offset: number; limit: number }) =>
    queryOptions<News, ApiError>({
      queryKey: newsQueryKeys.list(params),
      queryFn: () => newsApi.getNews(params),
    }),
};
