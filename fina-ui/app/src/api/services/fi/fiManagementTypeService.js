import axiosInstance from "../../axios";

const PREFIX = "/fi/fiManagementType";

export const loadManagementTypes = () => {
  return axiosInstance.get(`${PREFIX}`);
};

export const deleteManagementType = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const editManagementType = (management) => {
  return axiosInstance.put(`${PREFIX}`, management);
};

export const addManagementType = (management) => {
  return axiosInstance.post(`${PREFIX}`, management);
};
