import { notificationApi } from "./api";
import { notificationQueries } from "./queries";
import { createQueryHook } from "../common/createQuery";
import { createMutationHook } from "../common/createMutation";

// --- Queries ---

export const useGetNotifications = createQueryHook(notificationQueries.list);

export const useGetNotificationSettings = createQueryHook(
  notificationQueries.settings,
);

// --- Mutations ---

export const useMarkNotificationAsRead = createMutationHook((queryClient) => ({
  mutationFn: notificationApi.markNotificationAsRead,
  onSuccess: () => {
    notificationQueries.markAsRead(queryClient);
  },
}));

export const useMarkAllNotificationsAsRead = createMutationHook(
  (queryClient) => ({
    mutationFn: notificationApi.markAllNotificationsAsRead,
    onSuccess: () => {
      notificationQueries.markAllAsRead(queryClient);
    },
  }),
);
