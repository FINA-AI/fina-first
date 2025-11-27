import axiosInstance from "../axios";

const PREFIX = "importmanager";

export const loadImportManagerData = (page, limit, columnFilter) => {
  return axiosInstance.get(`${PREFIX}/packages`, {
    params: {
      page: page,
      limit: limit,
      ...columnFilter,
    },
  });
};

export const importManagerFileDownoad = (fileId) => {
  return axiosInstance.get(`${PREFIX}/file/download/${fileId}`);
};

export const loadImportedReturns = (fileId) => {
  return axiosInstance.get(`${PREFIX}/importedreturns/${fileId}`);
};

export const loadXml = (importedReturnId) => {
  return axiosInstance.get(`${PREFIX}/xml/${importedReturnId}`);
};
