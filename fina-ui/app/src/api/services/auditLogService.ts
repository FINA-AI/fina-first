import axiosInstance from "../axios";
import { SortInfoType } from "../../types/common.type";

const PREFIX = "/audit";

export const loadAuditLogData = (filter = {}, sortInfo: SortInfoType) => {
  return axiosInstance.get(PREFIX, {
    params: {
      ...filter,
      ...sortInfo,
    },
  });
};

export const getEntityNames = () => {
  return axiosInstance.get(`${PREFIX}/entityNames`);
};
