export interface SystemNotification {
  datetimeAdded: number;
  datetimeRead: number;
  id: number;
  notification: string;
  notify: number;
}

export interface SystemNotificationCount {
  ALL: number;
  READ: number;
  UNREAD: number;
}
