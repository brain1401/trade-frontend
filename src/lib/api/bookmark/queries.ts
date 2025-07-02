import { queryOptions } from "@tanstack/react-query";
import type { GetBookmarksParamsV61, PaginatedBookmarksV61 } from "./types";
import { bookmarkApi } from "./api";
import type { ApiError } from "../common/ApiError";
import type { ApiResponse } from "@/types/common";

export const bookmarkQueryKeys = {
  all: () => ["bookmarks"] as const,
  lists: () => [...bookmarkQueryKeys.all(), "list"] as const,
  list: (params?: GetBookmarksParamsV61) =>
    [...bookmarkQueryKeys.lists(), params ?? {}] as const,
};

export const bookmarkQueries = {
  list: () =>
    queryOptions<PaginatedBookmarksV61, ApiError>({
      queryKey: bookmarkQueryKeys.list(),
      queryFn: () => bookmarkApi.getBookmarks(),
    }),
};
