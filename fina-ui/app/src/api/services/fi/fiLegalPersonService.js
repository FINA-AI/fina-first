import axiosInstance from "../../axios";

export const getAllLegalPersonSimple = (
  excludeInactive = true,
  excludeDeleted = true
) => {
  return axiosInstance.get(`/legalperson/simple`, {
    params: {
      excludeInactive: excludeInactive,
      excludeDeleted: excludeDeleted,
    },
  });
};

export const loadLegalPersons = (page, limit, fiId, filterValue) => {
  return axiosInstance.get(`/legalperson/fi/${fiId}`, {
    params: {
      page: page,
      limit: limit,
      filterValue: filterValue,
      excludeInactive: false,
    },
  });
};

export const getLegalPersonById = (id) => {
  return axiosInstance.get(`/legalperson/${id}`);
};

export const addLegalPerson = (data, fiId) => {
  return axiosInstance.put(`/legalperson/fi/${fiId}`, data);
};

export const createLegalPerson = (fiId, fiPerson) => {
  return axiosInstance.post(`/legalperson/fi/${fiId}`, fiPerson, {
    params: {
      fiId,
    },
  });
};

export const updateLegalPerson = (fiId, fiPerson) => {
  return axiosInstance.put(`/legalperson/fi/${fiId}`, fiPerson, {
    params: {
      fiId,
    },
  });
};

export const deleteFiMultiLegalPersons = (fiId, data) => {
  return axiosInstance.delete(`/legalperson/fi/${fiId}`, { data });
};
