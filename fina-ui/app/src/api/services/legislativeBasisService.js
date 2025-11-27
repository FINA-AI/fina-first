import axiosInstance from "../axios";

const LEGISLATIVE = "legislative/";

export const getLegislativeBasisData = () => {
  return axiosInstance.get(`${LEGISLATIVE}categories`);
};

export const getLegislativeBasisDataItem = (id) => {
  return axiosInstance.get(`${LEGISLATIVE}categories/${id}/documents`);
};

export const downloadLegislativeBasisDataItem = (id) => {
  return axiosInstance.get(`${LEGISLATIVE}document/download/${id}`);
};
