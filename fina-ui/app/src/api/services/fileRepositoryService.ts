import axiosInstance from "../axios";

const PREFIX = "/jcr/repository";

export const loadFileSpaces = (
  start: number,
  limit: number,
  nodeId: string,
  filterByName?: string
) => {
  return axiosInstance.get(`${PREFIX}/user/files/${nodeId}`, {
    params: {
      start: start,
      limit: limit,
      filterByName: filterByName,
    },
  });
};

export const loadFileSpacesVersionService = (nodeId: string) => {
  return axiosInstance.get(`${PREFIX}/user/file/versions/${nodeId}`, {
    params: { orderBy: "lastModified DESC" },
  });
};
