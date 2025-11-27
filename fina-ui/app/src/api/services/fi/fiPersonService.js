import axiosInstance from "../../axios";

export const loadAllPersons = (
  page,
  limit,
  excludeInactive = false,
  excludeDeleted = true
) => {
  return axiosInstance.get(`/person/all`, {
    params: {
      page: page,
      limit: limit,
      excludeInactive: excludeInactive,
      excludeDeleted: excludeDeleted,
    },
  });
};

export const loadFiPhysicalPersons = (page, limit, fiId, filterValue) => {
  return axiosInstance.get(`/person/fi/persons/${fiId}`, {
    params: {
      page: page,
      limit: limit,
      filterValue: filterValue,
    },
  });
};

export const loadFiPerson = (fiId, fiPersonId) => {
  return axiosInstance.get(`/person/fi/${fiId}/${fiPersonId}`);
};

export const createFiPerson = (fiId, fiPerson) => {
  return axiosInstance.post(`/person`, fiPerson, {
    params: {
      fiId,
    },
  });
};

export const updateFiPerson = (fiId, fiPerson) => {
  return axiosInstance.put(`/person`, fiPerson, {
    params: {
      fiId,
    },
  });
};

export const deleteFiPerson = (fiId, fiPersonId) => {
  return axiosInstance.delete(`/person/${fiId}/${fiPersonId}`);
};

export const getPersonInfo = (fiPersonId) => {
  return axiosInstance.get(`/person/${fiPersonId}`);
};

export const deleteFiMultiPerson = (fiId, data) => {
  return axiosInstance.delete(`/person/fi/${fiId}`, { data });
};
