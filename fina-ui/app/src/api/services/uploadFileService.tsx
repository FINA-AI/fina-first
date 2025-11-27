import axiosInstance from "../axios";
import { UploadFileFilterType } from "../../types/uploadFile.type";

export const getUploadFiles = (filters: UploadFileFilterType) => {
  return axiosInstance.get("/uploadFile/load", {
    params: {
      ...filters,
    },
  });
};

export const uploadFile = (
  file: any,
  cancelTokenSource: any,
  onUploadProgress: any
) => {
  return axiosInstance.post("/uploadFile", file, {
    timeout: 0,
    headers: {
      "Content-type": "application/octet-stream",
      "X-File-Name": file.name,
    },
    cancelToken: cancelTokenSource,
    onUploadProgress: onUploadProgress,
    params: {
      convert: true,
    },
  });
};

export const getUploadFileStatuses = () => {
  return axiosInstance.get("/uploadFile/statuses");
};

export const getFileDetails = (fileId: number) => {
  return axiosInstance.get(`/uploadFile/${fileId}`);
};

export const getUploadFileImportStatuses = (fileId: number) => {
  return axiosInstance.get(`/uploadFile/importStatus/${fileId}`);
};

export const deleteUploadFile = (data: any) => {
  return axiosInstance.delete(`/uploadFile/files/delete`, {
    params: {
      fileId: data,
    },
  });
};

export const getUploadFileConfig = () => {
  return axiosInstance.get("/uploadFile/config");
};
