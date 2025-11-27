import axiosInstance from "../axios";
const PREFIX = "/cems";

export const loadCEMSRecommendations = (inspectionId, filter = {}) => {
  return axiosInstance.get(`${PREFIX}/recommendations/load/${inspectionId}`, {
    params: {
      ...filter,
    },
  });
};

export const deleteCEMSRecommendations = (data) => {
  return axiosInstance.delete(`${PREFIX}/recommendations`, { data });
};

export const loadSingleCEMSRecommendation = (recommendationId) => {
  return axiosInstance.get(`${PREFIX}/recommendations/${recommendationId}`);
};

export const saveRecommendation = (inspectionId, data) => {
  return axiosInstance.post(`${PREFIX}/recommendations/${inspectionId}`, data);
};

export const loadRecommendationsHistory = (recommendationId) => {
  return axiosInstance.get(
    `${PREFIX}/recommendations/history/${recommendationId}`
  );
};
