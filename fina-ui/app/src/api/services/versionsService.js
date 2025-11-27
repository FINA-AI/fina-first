import axiosInstance from "../axios";

export const getVersions = (loadAll = true) => {
  return axiosInstance.get(`/returns/versions`, {
    params: {
      loadAll,
    },
  });
};

export const versionsPost = (data) => {
  return axiosInstance.post(`/returns/versions`, data);
};

export const versionsPut = (data, returnVersionId) => {
  return axiosInstance.put(`/returns/versions/${returnVersionId}`, data);
};

export const versionsDelete = (returnVersionId) => {
  return axiosInstance.delete(`/returns/versions/${returnVersionId}`);
};
