import axiosInstance from "../axios";

const PREFIX = "/faq";

export const getAllFAQ = (page, limit, searchValue) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      searchValue: searchValue,
    },
  });
};

export const getFAQByCategory = (id, page, limit) => {
  return axiosInstance.get(`${PREFIX}/${id}`, {
    params: {
      start: page,
      limit: limit,
    },
  });
};

export const getFAQCategories = (id) => {
  return axiosInstance.get(`${PREFIX}/category/${id}`);
};

export const deleteFaqCategory = (id) => {
  return axiosInstance.delete(`${PREFIX}/category/${id}`);
};

export const deleteFaqCategoryItem = (categoryId, faqId) => {
  return axiosInstance.delete(`${PREFIX}/${categoryId}/${faqId}`);
};

export const updateFaqSequence = (faqId, body) => {
  return axiosInstance.put(`${PREFIX}/${faqId}`, body);
};

export const postCategory = (data) => {
  return axiosInstance.post(`${PREFIX}/category`, data);
};

export const postQuestion = (id, data) => {
  return axiosInstance.post(`${PREFIX}/${id}`, data);
};

export const categoryPut = (id, data) => {
  return axiosInstance.put(`${PREFIX}/category/${id}`, data);
};

export const questionPut = (id, data) => {
  return axiosInstance.put(`${PREFIX}/${id}`, data);
};

export const moveFaqItem = (id, moveUp) => {
  return axiosInstance.post(
    `${PREFIX}/item/move/${id}`,
    {},
    {
      params: {
        moveUp: moveUp,
      },
    }
  );
};
