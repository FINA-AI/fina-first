import axiosInstance from "../axios";

const PREFIX = "returns/schedule";
export const loadReturnCreationSchedules = (
  pagingPage,
  pagingLimit,
  taskName,
  sortField
) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: pagingPage,
      limit: pagingLimit,
      taskName: taskName,
      ...sortField,
    },
  });
};

export const saveReturnCreationSchedule = (data) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const loadSchedules = (id) => {
  return axiosInstance.get(`${PREFIX}/${id}/schedules`);
};

export const deleteReturnCreationSchedule = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const runReturnSchedule = (report) => {
  return axiosInstance.post(`${PREFIX}/run`, report);
};
