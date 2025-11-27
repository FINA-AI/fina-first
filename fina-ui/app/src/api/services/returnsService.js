import axiosInstance from "../axios";

export const getReturnDefinitions = (params) => {
  return axiosInstance.get(`/rdefinitions`, {
    params: {
      ...params,
    },
  });
};

export const getReturnTypes = () => {
  return axiosInstance.get(`/returntype`);
};

export const returnTypesPost = (data) => {
  return axiosInstance.post("/returntype", data);
};

export const removeReturnType = (returnTypeId) => {
  return axiosInstance.delete(`/returntype/${returnTypeId}`);
};

export const returnTypesPut = (data) => {
  return axiosInstance.put(`/returntype`, data);
};

export const createReturns = (versionId, data) => {
  return axiosInstance.post("/returns/create", data, {
    params: {
      versionId: versionId,
    },
  });
};

export const processReturns = (returns) => {
  return axiosInstance.post("/returns/process", returns, {
    timeout: 0,
  });
};

export const getReturnPackages = (
  page,
  limit,
  filteredData,
  cancelTokenSource,
  sortField = {}
) => {
  return axiosInstance.get("/returns/packages", {
    cancelToken: cancelTokenSource,
    params: {
      page: page,
      limit: limit,
      ...filteredData,
      ...sortField,
    },
  });
};

export const getReturnPackagesChildren = (
  fiId,
  periodId,
  returnTypeId,
  versionId,
  filteredData
) => {
  return axiosInstance.get("/returns/returns", {
    params: {
      fiId: fiId,
      periodId: periodId,
      returnTypeId: returnTypeId,
      versionId: versionId,
      ...filteredData,
    },
  });
};

export const saveReturnAs = (data) => {
  return axiosInstance.post("/returns/saveAs", data);
};

export const getImportedXml = (returnId) => {
  return axiosInstance.get(`/returns/returnXml/${returnId}`);
};

export const getReturnStatus = (returnId) => {
  return axiosInstance.get(`/returns/returnStatus/${returnId}`);
};

export const getReturnInfo = (returnId) => {
  return axiosInstance.get(`/returns/header/info/${returnId}`);
};

export const changedReturnStatusService = (data) => {
  return axiosInstance.post("/returns/status/update", data);
};

export const deleteReturnService = (data) => {
  return axiosInstance.delete(`/returns`, { data });
};
