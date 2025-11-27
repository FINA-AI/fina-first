import axiosInstance from "../../axios";

const PREFIX = "/fi/share";

export const getFIShares = (fiId, filters) => {
  return axiosInstance.get(`${PREFIX}/${fiId}`, {
    params: {
      ...filters,
    },
  });
};

export const deleteShare = (companyId, fiId) => {
  return axiosInstance.delete(`${PREFIX}/${companyId}/${fiId}`);
};

export const createShare = (fiId, data) => {
  return axiosInstance.post(`${PREFIX}/${fiId}`, data);
};

export const updateShare = (fiId, data) => {
  return axiosInstance.put(`${PREFIX}/${fiId}`, data);
};
