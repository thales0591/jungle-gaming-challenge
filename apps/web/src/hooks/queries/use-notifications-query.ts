import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotificationsRequest,
  getUnreadCountRequest,
  markNotificationAsReadRequest,
  markAllNotificationsAsReadRequest,
} from "@/services/notifications";
import type { Notification } from "@/services/notifications/interface";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (page: number, size: number) =>
    [...notificationsKeys.all, "list", { page, size }] as const,
  unreadCount: () => [...notificationsKeys.all, "unread-count"] as const,
};

export function useNotificationsQuery(page = 1, size = 50) {
  return useQuery({
    queryKey: notificationsKeys.list(page, size),
    queryFn: () => fetchNotificationsRequest({ page, size }),
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: getUnreadCountRequest,
  });
}

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsReadRequest,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.all });

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationsKeys.list(1, 50)
      );
      const previousCount = queryClient.getQueryData<number>(
        notificationsKeys.unreadCount()
      );

      queryClient.setQueryData<Notification[]>(
        notificationsKeys.list(1, 50),
        (old) =>
          old?.map((n) =>
            n.id === notificationId ? { ...n, haveBeenRead: true } : n
          )
      );

      queryClient.setQueryData<number>(
        notificationsKeys.unreadCount(),
        (old) => (old ? Math.max(0, old - 1) : 0)
      );

      return { previousNotifications, previousCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsKeys.list(1, 50),
          context.previousNotifications
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          notificationsKeys.unreadCount(),
          context.previousCount
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsReadRequest,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.all });

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationsKeys.list(1, 50)
      );
      const previousCount = queryClient.getQueryData<number>(
        notificationsKeys.unreadCount()
      );

      queryClient.setQueryData<Notification[]>(
        notificationsKeys.list(1, 50),
        (old) => old?.map((n) => ({ ...n, haveBeenRead: true }))
      );

      queryClient.setQueryData<number>(notificationsKeys.unreadCount(), 0);

      return { previousNotifications, previousCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsKeys.list(1, 50),
          context.previousNotifications
        );
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          notificationsKeys.unreadCount(),
          context.previousCount
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
