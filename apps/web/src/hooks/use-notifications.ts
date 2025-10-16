import {
  useNotificationsQuery,
  useUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "./queries/use-notifications-query";

export function useNotifications() {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const { data: unreadCount = 0 } = useUnreadCountQuery();
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
  };
}
