import axiosInstance from "../../axios";

export const getFiObjectConfigFieldsByType = (objectType) => {
  return axiosInstance.get(`/fi/config/object/${objectType}`);
};
