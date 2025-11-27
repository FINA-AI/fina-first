import axiosInstance from "../../axios";

const PREFIX = "/fi/branchType";

export const loadBranchTypes = () => {
  return axiosInstance.get(`${PREFIX}`);
};

export const loadBranchTypesWithCount = (fiId) => {
  return axiosInstance.get(`${PREFIX}/count`, {
    params: {
      fiId: fiId,
      includeAll: true,
    },
  });
};

export const deleteBranchType = (id) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const editBranchType = (branchType) => {
  return axiosInstance.put(`${PREFIX}`, branchType);
};

export const addBranchType = (branchType) => {
  return axiosInstance.post(`${PREFIX}`, branchType);
};
