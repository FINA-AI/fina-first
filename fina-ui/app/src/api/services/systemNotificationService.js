import axiosInstance from "../axios";

const PREFIX = "/system/notification";

export const getSystemNotifications = (page, limit, filter) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      filter,
    },
  });
};

export const getSystemNotificationsTotalNumber = () => {
  return axiosInstance.get(`${PREFIX}/caountall`);
};

export const getNewSystemNotificationCount = () => {
  return axiosInstance.get(`${PREFIX}/countnew`)
}
