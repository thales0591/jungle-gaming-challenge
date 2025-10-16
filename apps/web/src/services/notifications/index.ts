import type {
  Notification,
  FetchNotificationsRequestData,
  UnreadCountResponse,
} from "./interface";
import api from "../api";

export const fetchNotificationsRequest = async (
  requestData: FetchNotificationsRequestData
): Promise<Notification[]> => {
  const params = new URLSearchParams({
    page: requestData.page.toString(),
    size: requestData.size.toString(),
  });

  const { data } = await api.get(`/notifications?${params.toString()}`);
  return data;
};

export const getUnreadCountRequest = async (): Promise<number> => {
  const { data } = await api.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );
  return data.count;
};

export const markNotificationAsReadRequest = async (
  notificationId: string
): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsReadRequest = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};
