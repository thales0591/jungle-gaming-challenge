export interface Notification {
  id: string;
  userId: string;
  content: string;
  haveBeenRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FetchNotificationsRequestData {
  page: number;
  size: number;
}

export interface UnreadCountResponse {
  count: number;
}
