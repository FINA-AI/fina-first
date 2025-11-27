import axiosInstance from "../axios";

export const loadLegalPersons = (page, limit, filter) => {
  return axiosInstance.get(`/legalperson/`, {
    params: {
      page: page,
      limit: limit,
      excludeInactive: false,
      ...filter,
    },
  });
};

export const createLegalPerson = (fiPerson) => {
  return axiosInstance.post(`/legalperson`, fiPerson, {});
};

export const deletePersons = (data) => {
  return axiosInstance.delete(`/legalperson/`, { data });
};

export const updateLegalPerson = (data) => {
  return axiosInstance.put(`/legalperson/`, data);
};

export const loadConnectionGraph = (companyId = -1) => {
  return axiosInstance.get(`/legalperson/connection/graph/${companyId}`);
};

export const loadConnectionInfo = (sourceId, destinationId, connectionType) => {
  return axiosInstance.get(
    `/legalperson/connection/info/${sourceId}/${destinationId}/${connectionType}`
  );
};

export const saveConnectionInfo = (data) => {
  return axiosInstance.post("/legalperson/connection/info", data);
};

export const getLegalPersonConnections = (id) => {
  return axiosInstance.get(`/legalperson/dependencies/${id}`);
};

export const restoreLegalPerson = (fiId, body) => {
  return axiosInstance.post(`/legalperson/activate/${fiId}`, body);
};
