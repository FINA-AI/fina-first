import axiosInstance from "../axios";

export const loadActiveUsersService = () => {
  return axiosInstance.get("user/active", {});
};
