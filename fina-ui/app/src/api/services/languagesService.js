import axiosInstance from "../axios";

const PREFIX = "/languages";

export const deleteLanguage = (langID) => {
  return axiosInstance.delete(`${PREFIX}/${langID}`);
};

export const editLanguage = (body) => {
  return axiosInstance.put(`${PREFIX}`, body);
};

export const getLanguages = () => {
  return axiosInstance.get(`${PREFIX}`);
};

export const addNewLanguage = (body) => {
  return axiosInstance.post(`${PREFIX}`, body);
};

export const activateLang = (id) => {
  return axiosInstance.post(`${PREFIX}/activate/${id}`);
};
