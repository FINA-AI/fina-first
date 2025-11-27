import axiosInstance from "../axios";
const PREFIX = "/cems/sanction";

export const loadSanctions = (inspectionId, filter = {}) => {
  return axiosInstance.get(`${PREFIX}/${inspectionId}`, {
    params: {
      ...filter,
    },
  });
};

export const deleteSanctions = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const loadSingleSanction = (sanctionId) => {
  return axiosInstance.get(`${PREFIX}/load/${sanctionId}`);
};

export const saveSanction = (inspectionId, data) => {
  return axiosInstance.post(`${PREFIX}/${inspectionId}`, data);
};

export const loadDecisionMakingBodyCatalog = () => {
  return axiosInstance.get(`${PREFIX}/catalog/decisionBody`);
};
export const loadMeasureOfInfluenceCatalogData = () => {
  return axiosInstance.get(`${PREFIX}/catalog/measure`);
};

export const loadMeasureOfReasonsCatalogData = () => {
  return axiosInstance.get(`${PREFIX}/catalog/reason`);
};

export const loadRegulationsCatalog = () => {
  return axiosInstance.get(`${PREFIX}/catalog/regulation`);
};
