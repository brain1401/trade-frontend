import type { QueryClient } from "@tanstack/react-query";
import type { UpdateBookmarkRequestV61 } from "../../../types/bookmark";
import { bookmarkApi } from "./api";
import { bookmarkQueries, bookmarkQueryKeys } from "./queries";
import { createQueryHook } from "../common/createQuery";
import { createMutationHook } from "../common/createMutation";

// --- Query ---

export const useGetBookmarks = createQueryHook(bookmarkQueries.list);

// --- Mutations ---

const invalidateBookmarks = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all() });
};

export const useAddBookmark = createMutationHook((queryClient) => ({
  mutationFn: bookmarkApi.addBookmark,
  onSuccess: () => invalidateBookmarks(queryClient),
}));

type UpdateBookmarkVariables = {
  bookmarkId: string;
  updateData: UpdateBookmarkRequestV61;
};

export const useUpdateBookmark = createMutationHook((queryClient) => ({
  mutationFn: (variables: UpdateBookmarkVariables) =>
    bookmarkApi.updateBookmark(variables.bookmarkId, variables.updateData),
  onSuccess: () => invalidateBookmarks(queryClient),
}));

export const useDeleteBookmark = createMutationHook((queryClient) => ({
  mutationFn: bookmarkApi.deleteBookmark,
  onSuccess: () => invalidateBookmarks(queryClient),
}));
