import axiosInstance from "../../axios";

const PREFIX = "/fi/branch";

export const load = (fiId, page, limit) => {
  return axiosInstance.get(`${PREFIX}/${fiId}`, {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const loadByType = (fiId, page, limit, typeId, filter) => {
  return axiosInstance.get(`${PREFIX}/${fiId}/${typeId}`, {
    params: {
      page: page,
      limit: limit,
      ...filter,
    },
  });
};

export const get = (id) => {
  return axiosInstance.get(`${PREFIX}/branch/${id}`);
};

export const deleteBranch = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const save = (branch) => {
  return axiosInstance.post(`${PREFIX}`, branch);
};

export const deleteFiMultiBranch = (fiId, data) => {
  return axiosInstance.delete(`${PREFIX}/branches/${fiId}`, { data });
};
