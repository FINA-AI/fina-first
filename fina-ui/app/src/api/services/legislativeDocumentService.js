import axiosInstance from "../axios";

const PREFIX = "legislative";

export const getLegislativeCategories = () => {
  return axiosInstance.get(`${PREFIX}/categories`);
};

export const getLegislativeCategoryDocuments = (fiTypeId, categoryId) => {
  return axiosInstance.get(
    `${PREFIX}/categories/${fiTypeId}/${categoryId}/documents`
  );
};

export const deleteLegislativeCategoryDocument = (id) => {
  return axiosInstance.delete(`${PREFIX}/document/${id}`);
};

export const deleteLegislativeCategory = (id) => {
  return axiosInstance.delete(`${PREFIX}/categories/${id}`);
};

export const postCategoryDocument = (fiTypeId, categoryId, data) => {
  return axiosInstance.post(
    `${PREFIX}/document/upload/${fiTypeId}/${categoryId}`,
    data
  );
};

export const postCategory = (data) => {
  return axiosInstance.post(`${PREFIX}/categories`, data);
};

export const getDocuments = (categoryId) => {
  return axiosInstance.get(`${PREFIX}/categories/${categoryId}/documents`);
};

export const getFilteredCategories = (fileName) => {
  return axiosInstance.get(`${PREFIX}/categories/documents`, {
    params: { fileName: fileName },
  });
};
