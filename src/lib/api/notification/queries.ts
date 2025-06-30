import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { notificationApi } from "./api";
import type { Notification } from "@/types/notification";
import type { ApiResponse } from "@/types/common";
import type { SmsSettingsResponse } from "./types";

export const notificationQueryKeys = {
  all: () => ["notifications"] as const,

  lists: () => [...notificationQueryKeys.all(), "list"] as const,
  list: () => [...notificationQueryKeys.lists()] as const,

  settingsKey: () => [...notificationQueryKeys.all(), "settings"] as const,
};

export const notificationQueries = {
  list: () =>
    queryOptions<Notification[]>({
      queryKey: notificationQueryKeys.list(),
      queryFn: notificationApi.getNotifications,
    }),
  settings: () =>
    queryOptions<ApiResponse<SmsSettingsResponse>>({
      queryKey: notificationQueryKeys.settingsKey(),
      queryFn: notificationApi.getNotificationSettings,
    }),

  // Mutations
  markAsRead: (queryClient: QueryClient) => ({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all() });
    },
  }),

  markAllAsRead: (queryClient: QueryClient) => ({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: notificationQueryKeys.lists(),
      });
      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationQueryKeys.list(),
      );
      queryClient.setQueryData<Notification[]>(
        notificationQueryKeys.list(),
        (oldData) =>
          oldData?.map((notification) => ({ ...notification, isRead: true })) ||
          [],
      );
      return { previousNotifications };
    },
    onError: (
      err: Error,
      variables: void,
      context?: { previousNotifications: Notification[] | undefined },
    ) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationQueryKeys.list(),
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.lists(),
      });
    },
  }),
};
