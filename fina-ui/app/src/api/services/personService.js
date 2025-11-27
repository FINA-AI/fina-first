import axiosInstance from "../axios";

const PREFIX = "/person";

export const loadAllPersons = (
  page,
  limit,
  excludeInactive = false,
  excludeDeleted = false,
  columnFilter
) => {
  return axiosInstance.get(`${PREFIX}/all`, {
    params: {
      page: page,
      limit: limit,
      ...columnFilter,
      excludeInactive: excludeInactive,
      excludeDeleted: excludeDeleted,
    },
  });
};

export const createPerson = (Id, Person) => {
  return axiosInstance.post(`${PREFIX}`, Person, {
    params: {
      Id,
    },
  });
};

export const deletePersons = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const deletePerson = (personId) => {
  return axiosInstance.delete(`${PREFIX}/${personId}`);
};

export const getPersonById = (personId, active, organizationType, pages) => {
  return axiosInstance.get(`${PREFIX}/${personId}`, {
    params: {
      active: active,
      organizationType: organizationType,
      pages: pages,
    },
  });
};

export const updatePerson = (person) => {
  return axiosInstance.put(`${PREFIX}`, person);
};

export const filterConnections = (
  personId,
  active,
  organizationType,
  pages
) => {
  return axiosInstance.get(`${PREFIX}/connections/${personId}`, {
    params: {
      active: active,
      organizationType: organizationType,
      pages: pages,
    },
  });
};

export const restorePhysicalPerson = (fiId, body) => {
  return axiosInstance.post("person/activate", body, {
    params: {
      fiId: fiId,
    },
  });
};
