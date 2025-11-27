import axiosInstance from "../axios";

const PREFIX = "security/config";
export const loadAboutData = () => {
  return axiosInstance.get(`${PREFIX}/about`);
};
