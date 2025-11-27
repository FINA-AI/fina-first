import axiosInstance from "../../axios";

const PREFIX = "/fi/fiManagement";

export const loadFiManagement = (page, limit, fiId, typeId, filterString) => {
  return axiosInstance.get(`${PREFIX}/${fiId}/${typeId}`, {
    params: {
      page: page,
      limit: limit,
      filter: filterString,
    },
  });
};

export const deleteFiManagement = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const editFiManagement = (management) => {
  return axiosInstance.put(`${PREFIX}`, management);
};

export const addFiManagement = (fiId, managementTypeId, management) => {
  return axiosInstance.post(
    `${PREFIX}/${fiId}/${managementTypeId}`,
    management
  );
};

export const getFiManagementById = (fiManagementId) => {
  return axiosInstance.get(`${PREFIX}/${fiManagementId}`);
};

export const getFiManagementHistory = (fiId, managementId, page, limit) => {
  return axiosInstance.get(`fi/history/management/${fiId}/${managementId}`, {
    params: {
      page: page,
      limit: limit,
    },
  });
};
