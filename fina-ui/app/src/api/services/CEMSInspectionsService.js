import axiosInstance from "../axios";

const PREFIX = "/cems";

export const loadInspections = (page, limit, filter = {}) => {
  return axiosInstance.get(`${PREFIX}/inspection`, {
    params: {
      page: page,
      limit: limit,
      ...filter,
    },
  });
};

export const loadInspection = (id) => {
  return axiosInstance.get(`${PREFIX}/inspection/${id}`);
};

export const saveInspection = (inspection) => {
  return axiosInstance.post(`${PREFIX}/inspection`, inspection);
};

export const deleteInspection = (data) => {
  return axiosInstance.delete(`${PREFIX}/inspection`, { data });
};

export const exportInspections = (filter = {}) => {
  return axiosInstance.get(`${PREFIX}/export/inspections`, {
    params: {
      ...filter,
    },
  });
};
