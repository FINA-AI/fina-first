import axiosInstance from "../axios";

const PREFIX = "/communicator/notifications";

export const loadNotifications = (page, pageLimit, filter) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: pageLimit,
      ...filter,
    },
  });
};

export const sendNotifications = (data) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const deleteNotification = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const publishNotifications = (data) => {
  return axiosInstance.post(`${PREFIX}/publish`, data);
};

export const getNotificationUsers = (
  notificationId,
  page,
  limit,
  filterValue
) => {
  return axiosInstance.get(`${PREFIX}/users/${notificationId}`, {
    params: {
      page: page,
      limit: limit,
      ...filterValue,
    },
  });
};

export const loadNotificationRecipientUserIds = (notificationId) => {
  return axiosInstance.get(`${PREFIX}/${notificationId}/recipientIds`);
};

export const loadNotificationAttachments = (notificationId) => {
  return axiosInstance.get(`${PREFIX}/attachments/${notificationId}`);
};

export const loadRecipientsData = (notificationId) => {
  return axiosInstance.get(`${PREFIX}/recipients/${notificationId}`);
};
