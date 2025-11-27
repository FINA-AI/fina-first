import axiosInstance from "../axios";

const PREFIX = "/license";

export const getLicenseTypes = () => {
  return axiosInstance.get(`${PREFIX}/types/`);
};

export const addLicenseTypes = (data) => {
  return axiosInstance.post(`${PREFIX}/types/`, data);
};

export const loadLicenses = (page, limit, filterValue, fiId) => {
  return axiosInstance.get(`fi/${fiId}/license`, {
    params: {
      page: page,
      limit: limit,
      filterValue: filterValue,
    },
  });
};

export const getLicenseById = (fiId, licenseId) => {
  return axiosInstance.get(`fi/license/${fiId}/${licenseId}`);
};

export const deleteLicense = (licenseId) => {
  return axiosInstance.delete(`fi/license/${licenseId}`);
};

export const saveLicense = (data) => {
  return axiosInstance.post(`fi/license`, data);
};

export const getLicenseType = (licenseTypeId) => {
  return axiosInstance.get(`${PREFIX}/types/${licenseTypeId}`);
};

export const getLicenseOperation = (licenseTypeId, parentId) => {
  return axiosInstance.get(`${PREFIX}/operations/${licenseTypeId}/${parentId}`);
};

export const saveLicenseOperation = (data) => {
  return axiosInstance.post(`${PREFIX}/operation/`, data);
};

export const updateLicenseOperation = (data) => {
  return axiosInstance.put(`${PREFIX}/operation/`, data);
};

export const deleteLicenseOperation = (id) => {
  return axiosInstance.delete(`${PREFIX}/operation/${id}`);
};

export const deleteLicenseType = (id) => {
  return axiosInstance.delete(`${PREFIX}/types/${id}`);
};

export const saveLicenseComment = (licenseId, data) => {
  return axiosInstance.post(`fi/license/${licenseId}/comment`, data);
};

export const deleteLicenseComment = (commentId) => {
  return axiosInstance.delete(`fi/license/comment/${commentId}`);
};

export const saveBankingOperationComment = (operationId, data) => {
  return axiosInstance.post(`fi/license/${operationId}`, data);
};

export const deleteBankingOperationComment = (operationId) => {
  return axiosInstance.delete(`fi/license/operation/comment/${operationId}`);
};
