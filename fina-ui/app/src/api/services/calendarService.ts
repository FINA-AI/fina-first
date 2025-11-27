import axiosInstance from "../axios";
import { CalendarDataType } from "../../types/calendar.type";

const PREFIX = "/calendar";

export const load = (from: number, to: number) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      from: from,
      to: to,
    },
  });
};

export const get = (id: number) => {
  return axiosInstance.get(`${PREFIX}/branch/${id}`);
};

export const deleteEvent = (id: string, eventDeleteType: string) => {
  return axiosInstance.delete(`${PREFIX}/${id}`, {
    params: {
      eventDeleteType: eventDeleteType,
    },
  });
};

export const save = (event: CalendarDataType) => {
  return axiosInstance.post(`${PREFIX}`, event);
};

export const saveMultiple = (eventCreateModel: CalendarDataType) => {
  return axiosInstance.post(`${PREFIX}/multiple`, eventCreateModel);
};
