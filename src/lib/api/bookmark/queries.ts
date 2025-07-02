import { queryOptions } from "@tanstack/react-query";
import type { BookmarkData } from "./types";
import { bookmarkApi } from "./api";
import type { ApiError } from "../common/ApiError";
import type { ApiResponse } from "@/types/common";

export const bookmarkQueryKeys = {
  all: () => ["bookmarks"] as const,
  lists: () => [...bookmarkQueryKeys.all(), "list"] as const,
  list: () =>
    [...bookmarkQueryKeys.lists()] as const,
};

export const bookmarkQueries = {
  list: () =>
    queryOptions<BookmarkData, ApiError>({
      queryKey: bookmarkQueryKeys.list(),
      queryFn: () => bookmarkApi.getBookmarks(),
    }),
};
