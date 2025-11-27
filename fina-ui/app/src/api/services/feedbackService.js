import axiosInstance from "../axios";

const PREFIX = "feedback";

export const getFeedbackService = (page, limit) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page,
      limit,
    },
  });
};

export const getFeedbackCategoryService = (page, limit) => {
  return axiosInstance.get(`${PREFIX}/category`, {
    params: {
      page,
      limit,
    },
  });
};

export const deleteFeedbackService = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const deleteFeedbackCategoryService = (id) => {
  return axiosInstance.delete(`${PREFIX}/category/${id}`);
};

export const saveFeedbackCategoryService = (data) => {
  return axiosInstance.post(`${PREFIX}/category`, data);
};

export const editFeedbackCategoryService = (data) => {
  return axiosInstance.put(`${PREFIX}/category/${data.id}`, data);
};
