import axiosInstance from "../../axios";

const PREFIX = "/fi/config/structure";

export const load = () => {
  return axiosInstance.get(`${PREFIX}/`);
};

export const loadChildren = (id) => {
  return axiosInstance.get(`${PREFIX}/${id}/children`);
};

export const loadDefault = () => {
  return axiosInstance.get(`${PREFIX}/default`);
};

export const loadAll = () => {
  return axiosInstance.get(`${PREFIX}/all`);
};

export const save = (obj, checkDefault = false) => {
  return axiosInstance.post(`${PREFIX}`, obj, {
    params: {
      checkDefault: checkDefault,
    },
  });
};

export const getCheckedValues = (fiId) => {
  return axiosInstance.get(`fi/${fiId}/groups`);
};

export const setCheckedValues = (id, data) => {
  return axiosInstance.post(`fi/${id}/groups`, data);
};

export const makeDefaultCriterion = (id) => {
  return axiosInstance.post(`${PREFIX}/criterion/${id}/makeDefault`, {});
};

export const deleteParent = (id) => {
  return axiosInstance.delete(`${PREFIX}/parent/${id}`);
};

export const deleteChild = (id) => {
  return axiosInstance.delete(`${PREFIX}/child/${id}`);
};
