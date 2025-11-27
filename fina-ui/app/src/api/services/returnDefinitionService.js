import axiosInstance from "../axios";

const PREFIX = "/rdefinitions";

export const getReturnDefinitions = (page, limit, filters) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      ...filters,
    },
  });
};

export const deleteReturnDefinitions = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const loadReturnDefinitionTable = (rDefinitionId) => {
  return axiosInstance.get(`${PREFIX}/tables/${rDefinitionId}`);
};

export const addReturnDefinition = (data) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const generateReturnDefinitionTable = (data) => {
  return axiosInstance.post(`${PREFIX}/table/generate`, data);
};

export const rebuildReturnDependencyService = (requestTimeout) => {
  return axiosInstance.post(
    `${PREFIX}/cache/reset`,
    {},
    {
      timeout: requestTimeout,
    }
  );
};

export const updateTableSequence = (definitionId, tableIds) => {
  return axiosInstance.post(
    `${PREFIX}/reorder/${definitionId}`,
    {},
    {
      params: {
        tableIds,
      },
    }
  );
};
