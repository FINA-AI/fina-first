import axiosInstance from "../axios";
import { PeriodType } from "../../types/period.type";

const PREFIX = "/period/type";

export const getPeriodTypes = () => {
  return axiosInstance.get(`${PREFIX}`);
};

export const periodTypesPost = (data: PeriodType) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const periodTypesPut = (data: PeriodType, periodTypeId: number) => {
  return axiosInstance.put(`${PREFIX}/${periodTypeId}`, data);
};

export const periodTypesDelete = (periodTypeId: number) => {
  return axiosInstance.delete(`${PREFIX}/${periodTypeId}`);
};
