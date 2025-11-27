import axiosInstance from "../axios";

const PREFIX = "/mdt";

export const loadCurrentUserRootNodes = () => {
  return axiosInstance.get(`${PREFIX}/root`);
};

export const loadAllRootNodes = () => {
  return axiosInstance.get(`${PREFIX}/root/all`);
};
export const loadChildren = (parentId, foldersOnly) => {
  return axiosInstance.get(`${PREFIX}/children/${parentId}`, {
    params: {
      foldersOnly: foldersOnly && true,
    },
  });
};
export const filterNodes = (code, foldersOnly, nodeTypes) => {
  return axiosInstance.get(`${PREFIX}/filter/${code}`, {
    params: {
      nodeTypes: nodeTypes,
      foldersOnly: foldersOnly && true,
    },
  });
};

export const getPath = (nodeId) => {
  return axiosInstance.get(`${PREFIX}/path/${nodeId}`);
};

export const loadMDTDependencies = (nodeId) => {
  return axiosInstance.get(`${PREFIX}/dependencies/${nodeId}`);
};

export const getNodeComparisons = (nodeId, page, limit, filters) => {
  return axiosInstance.get(`${PREFIX}/comparison`, {
    params: {
      nodeId: nodeId,
      page: page,
      limit: limit,
      ...filters,
    },
  });
};

export const saveNodeComparison = (nodeComparison) => {
  return axiosInstance.post(`${PREFIX}/comparison`, nodeComparison);
};

export const deleteNodeComparison = (comparisonId, nodeId) => {
  return axiosInstance.delete(`${PREFIX}/comparison/${comparisonId}/${nodeId}`);
};

export const getAllMDTCode = (loadAll) => {
  return axiosInstance.get(`${PREFIX}/allCodes/`, {
    params: {
      loadAll: loadAll,
    },
  });
};

export const saveMDTNode = (mdtNode) => {
  return axiosInstance.post(`${PREFIX}`, mdtNode);
};

export const editMDTNode = (mdtNode) => {
  return axiosInstance.put(`${PREFIX}`, mdtNode);
};

export const deleteMDTNode = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data, timeout: 10 * 60 * 1000 });
};

export const mdtXmlGenerator = (file) => {
  return axiosInstance.post(`${PREFIX}/xml/generator`, file, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const runMdtTester = (parentNodeId) => {
  return axiosInstance.post(
    `${PREFIX}/tester/run/${parentNodeId}`,
    {},
    {
      //10 minutes
      timeout: 60 * 1000 * 10,
    }
  );
};

export const ruNmdtTesterFix = (ids) => {
  return axiosInstance.post(`${PREFIX}/tester/fix`, ids, {
    //2H
    timeout: 2 * 60 * 60 * 1000,
  });
};

export const mdtImportTranslation = (file) => {
  return axiosInstance.post(`${PREFIX}/import/translation`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const mdtImport = (file, parentNodeId) => {
  return axiosInstance.post(`${PREFIX}/import/${parentNodeId}`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const mdtPaste = (data) => {
  return axiosInstance.post(`${PREFIX}/paste`, data);
};
