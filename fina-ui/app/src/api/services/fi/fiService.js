import axiosInstance from "../../axios";

const PREFIX = "/fi";

export const loadFiTypes = (withFiStatistics = false) => {
  return axiosInstance.get(`${PREFIX}/types`, {
    params: {
      withFiStatistics: withFiStatistics,
    },
  });
};

export const loadFisByType = (fiTypeId, page, limit, filters) => {
  return axiosInstance.get(`${PREFIX}/${fiTypeId}`, {
    params: {
      page: page,
      limit: limit,
      excludeDisabledFis: false,
      ...filters,
    },
  });
};

export const loadCountedFisByFilter = (filters) => {
  return axiosInstance.get(`${PREFIX}/filter/count`, {
    params: {
      ...filters,
      excludeDisabledFis: false,
    },
  });
};

export const deleteFI = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const deleteFIs = (ids) => {
  return axiosInstance.post(`${PREFIX}/delete/fis`, ids);
};

export const createFi = (fi, removeFiPermissions) => {
  return axiosInstance.post(`${PREFIX}`, fi, {
    params: {
      removeFiPermissions: removeFiPermissions,
    },
  });
};

export const updateFiPermittedUsers = (fi) => {
  return axiosInstance.post(`${PREFIX}/${fi.id}/permitted/users/`, fi);
};

export const loadFi = (fiId) => {
  return axiosInstance.get(`${PREFIX}/load/${fiId}`);
};

export const loadLegalFormTypes = () => {
  return axiosInstance.get(`${PREFIX}/businessEntityTypes`);
};

export const loadEconomicEntityTypes = () => {
  return axiosInstance.get(`${PREFIX}/economicEntityTypes`);
};

export const loadEquityFormTypes = () => {
  return axiosInstance.get(`${PREFIX}/equityFormTypes`);
};

export const loadManagementFormTypes = () => {
  return axiosInstance.get(`${PREFIX}/managementFormTypes`);
};

export const loadFiTree = () => {
  return axiosInstance.get(`${PREFIX}/tree`);
};

export const loadPermittedUsers = (fiId) => {
  return axiosInstance.get(`${PREFIX}/permittedusers/${fiId}`);
};

export const loadResponsibleUsers = (fiId) => {
  return axiosInstance.get(`${PREFIX}/${fiId}/users`);
};

export const loadFIHistory = (fiId, page, limit) => {
  return axiosInstance.get(`${PREFIX}/history/${fiId}`, {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const importFis = (file) => {
  return axiosInstance.post(`${PREFIX}/import`, file, {
    timeout: 600_000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
