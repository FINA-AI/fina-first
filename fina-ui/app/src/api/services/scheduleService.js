import axiosInstance from "../axios";

const PREFIX = "/schedule";

export const loadSchedules = (page, limit, filterObject) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      ...filterObject,
    },
  });
};

export const deleteSchedule = (scheduleId) => {
  return axiosInstance.delete(`${PREFIX}/${scheduleId}`);
};



export const saveSchedule = (data) => {
  return axiosInstance.post(`${PREFIX}/generate`, data, {
    //10 minutes
    timeout: 60 * 1000 * 10,
  });
};

export const editSchedule = (data) => {
  return axiosInstance.put(`${PREFIX}/editDueDate`, data);
};

export const singleScheduleUpdate = (schedule) => {
  return axiosInstance.put(`${PREFIX}/save/${schedule.id}`, schedule);
};

export const deleteMultipleSchedules = (scheduleIds) => {
  return axiosInstance.delete(`${PREFIX}/remove`, { data: scheduleIds });
};
