import axiosInstance from "../axios";

export const logout = () => {
  return axiosInstance.get(`/security/logout`);
};
