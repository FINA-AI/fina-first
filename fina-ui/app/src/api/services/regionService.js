import axiosInstance from "../axios";

const PREFIX = "/region";

export const load = () => {
  return axiosInstance.get(`${PREFIX}/`);
};

export const loadPaths = () => {
  return axiosInstance.get(`${PREFIX}/path`);
};

export const loadProperties = () => {
  return axiosInstance.get(`${PREFIX}/properties`);
};

export const save = (obj) => {
  return axiosInstance.post(`${PREFIX}/`, obj);
};

export const deleteRegion = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const loadFirstLevel = () => {
  return axiosInstance.get(`${PREFIX}/firstLevel`);
};

export const addProperty = (data) => {
  return axiosInstance.post(`${PREFIX}/properties`, data);
};

export const deleteProperty = () => {
  return axiosInstance.delete(`${PREFIX}/properties`);
};

export const getCountryItemByParentId = (parentId) => {
  return axiosInstance.get(`${PREFIX}/children/${parentId}`);
};

export const loadRegionChildrenSearchPath = (parentId) => {
  return axiosInstance.get(`${PREFIX}/tree/${parentId}`);
};
export const getRegionFIs = (regionId) => {
  return axiosInstance.get(`fi/region/${regionId}`);
};

export const restore = (model) => {
  return axiosInstance.post(`${PREFIX}/restore/`, model);
};
