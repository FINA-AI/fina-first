import axiosInstance from "../axios";

export const getCatalogService = (page, limit, filterValue) => {
  return axiosInstance.get("catalog", {
    params: {
      page: page,
      limit: limit,
      filterValue: filterValue,
    },
  });
};

export const deleteCatalogService = (id) => {
  return axiosInstance.delete(`catalog/${id}`);
};

export const restoreCatalogService = (rowId) => {
  return axiosInstance.post(`catalog/deleted/restore/${rowId}`);
};

export const getCatalogItems = (
  id,
  parentRowId,
  page,
  limit,
  filterColumns
) => {
  return axiosInstance.get(`catalog/items/${id}/${parentRowId}`, {
    params: {
      page: page,
      limit: limit,
      filterColumns: filterColumns,
    },
  });
};

export const sendCatalogData = (id, data) => {
  return axiosInstance.post(`catalog/items/${id}`, data, {});
};

export const deleteCatalogRows = (
  catalogId,
  rowIDs,
  deleteChildren = false
) => {
  return axiosInstance.delete(`catalog/items/${catalogId}`, {
    params: {
      deleteChildren: deleteChildren,
      rowIds: rowIDs,
    },
  });
};

export const deleteCatalogData = (catalogId, rowId, deleteChildren = false) => {
  return axiosInstance.delete(
    `catalog/items/${catalogId}/${rowId}?deleteChildren=${deleteChildren}`
  );
};
export const UpdateCatalogData = (id, data) => {
  return axiosInstance.put(`catalog/items/${id}`, data, {});
};
export const GetCatalogHistory = (catalogId, rowNumber) => {
  return axiosInstance.get(`catalog/items/history/${catalogId}/${rowNumber}`);
};

export const ImportCatalogFile = (file, onUploadProgress) => {
  return axiosInstance.post("catalog/import", file, {
    timeout: 7200000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const submitCatalog = (data) => {
  return axiosInstance.post("catalog/submit", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const hasDependentRows = (catalogId, rowIds) => {
  return axiosInstance.get(`catalog/items/hasActiveDependencies/${catalogId}`, {
    params: {
      rowIds: rowIds,
    },
  });
};

export const nodeMove = (
  catalogId,
  itemRowId,
  itemRowNumber,
  itemParentRowId
) => {
  return axiosInstance.post(
    `catalog/${catalogId}/move/${itemRowId}/${itemRowNumber}/${itemParentRowId}`
  );
};
