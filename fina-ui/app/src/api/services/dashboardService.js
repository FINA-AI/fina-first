import axiosInstance from "../axios";

const PREFIX = "/dashboard";

export const createDashboard = (data) => {
  return axiosInstance.post(`${PREFIX}/dashboard`, data);
};

export const getDashboards = () => {
  return axiosInstance.get(`${PREFIX}/dashboard`);
};

export const deleteDashboard = (dashboardId) => {
  return axiosInstance.delete(`${PREFIX}/dashboard/${dashboardId}`);
};

export const updateDashboard = (data) => {
  return axiosInstance.put(`${PREFIX}/dashboard`, data);
};

export const getDashlets = (page, limit, filter = {}, sortField, sortDir) => {
  return axiosInstance.get(`${PREFIX}/dashlet`, {
    params: {
      page,
      limit,
      sortField,
      sortDir,
      ...filter,
    },
  });
};

export const getDashletPrev = (data) => {
  return axiosInstance.post(`${PREFIX}/dashlet/preview`, data);
};

export const createDashlet = (data) => {
  return axiosInstance.post(`${PREFIX}/dashlet`, data);
};

export const getDashletData = (dashletId) => {
  return axiosInstance.get(`${PREFIX}/dashlet/data/${dashletId}`);
};

export const deleteDashlet = (dashletId) => {
  return axiosInstance.delete(`${PREFIX}/dashlet/${dashletId}`);
};
