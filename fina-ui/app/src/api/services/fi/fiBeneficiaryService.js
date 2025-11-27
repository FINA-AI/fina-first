import axiosInstance from "../../axios";

const PREFIX = "/fi/beneficiary";

export const loadBeneficiaryTypes = (fiId) => {
  return axiosInstance.get(`${PREFIX}/${fiId}/count`);
};

export const loadBeneficiaries = (
  fiId,
  page,
  limit,
  filterType,
  filterValue
) => {
  return axiosInstance.get(`${PREFIX}/${fiId}`, {
    params: {
      page: page,
      limit: limit,
      filterType: filterType,
      filter: filterValue,
    },
  });
};

export const deleteBeneficiary = (fiId, beneficiaryId) => {
  return axiosInstance.delete(`${PREFIX}/${fiId}/${beneficiaryId}`);
};

export const saveBeneficiary = (fiId, data) => {
  return axiosInstance.post(`${PREFIX}/${fiId}`, data);
};

export const updateBeneficiary = (fiId, data) => {
  return axiosInstance.put(`${PREFIX}/${fiId}`, data);
};

export const getBeneficiaryById = (beneficiaryId) => {
  return axiosInstance.get(`${PREFIX}/item/${beneficiaryId}`);
};

export const loadBeneficiaryHistory = (beneficiaryId, page, limit) => {
  return axiosInstance.get(`/fi/history/beneficiary/${beneficiaryId}`, {
    params: {
      page: page,
      limit: limit,
    },
  });
};
