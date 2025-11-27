import axiosInstance from "../axios";

const PREFIX = "/legislative";

export const loadLegislativeCategories = () => {
  return axiosInstance.get(`${PREFIX}/categories`);
};

export const loadLegislativeDocuments = (categoryId) => {
  return axiosInstance.get(`${PREFIX}/categories/${categoryId}/documents`);
};

export const loadLegislativeFile = (fileId) => {
  return axiosInstance.get(`${PREFIX}/document/download/${fileId}`);
};
