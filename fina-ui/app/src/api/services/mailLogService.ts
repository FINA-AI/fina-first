import axiosInstance from "../axios";
import { FilterType } from "../../types/common.type";

const PREFIX = "/mail";

export const getMailLogs = (
  page: number,
  limit: number,
  filterObject: FilterType
) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      ...filterObject,
    },
  });
};

export const getMailReply = (mailId: number) => {
  return axiosInstance.get(`${PREFIX}/reply/${mailId}`);
};

export const getMailAttachments = (mailId: number) => {
  return axiosInstance.get(`${PREFIX}/attachments/${mailId}`);
};

export const getOrCreateSyncFlag = () => {
  return axiosInstance.get(`${PREFIX}/sync`);
};
