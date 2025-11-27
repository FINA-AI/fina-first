import axiosInstance from "../axios";

const PREFIX = "report";

export const loadReports = (parentId, reportType, skipEmptyFolders) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      parentId: parentId,
      reportType: reportType,
      skipEmptyFolders: skipEmptyFolders,
    },
  });
};

export const moveReport = (reportId, folderId) => {
  return axiosInstance.post(`${PREFIX}/move/${reportId}/${folderId}`);
};
export const moveUp = (selectedReport) => {
  return axiosInstance.post(`${PREFIX}/moveUp/`, selectedReport);
};
export const moveDown = (selectedReport) => {
  return axiosInstance.post(`${PREFIX}/moveDown/`, selectedReport);
};

export const getReportInfo = (reportId) => {
  return axiosInstance.get(`${PREFIX}/info/${reportId}`);
};

export const loadReportsParameters = (reportIds) => {
  return axiosInstance.get(`${PREFIX}/parameters/`, {
    params: {
      reportIds: reportIds,
    },
  });
};

export const loadGeneratedReports = (reportIds) => {
  return axiosInstance.get(`${PREFIX}/load/generated/`, {
    params: {
      reportIds: reportIds,
    },
  });
};

export const getReportStatistic = (reportId) => {
  return axiosInstance.get(`${PREFIX}/statistics/${reportId}`);
};

export const loadReportSchedules = () => {
  return axiosInstance.get(`${PREFIX}/schedule`);
};

export const reportScheduleRun = (report) => {
  return axiosInstance.post(`${PREFIX}/schedule/run`, report);
};

export const getStoredReportParents = () => {
  return axiosInstance.get(`${PREFIX}/stored/folders`);
};

export const getAllStoredReports = () => {
  return axiosInstance.get(`${PREFIX}/stored/all`);
};

export const getStoredReportChildren = (parentId, sortField, sortDirection) => {
  return axiosInstance.get(`${PREFIX}/stored/${parentId}`, {
    params: {
      sortField: sortField,
      sortDirection: sortDirection,
    },
  });
};

export const getStoredReportRowInfo = (reportId, hashCode) => {
  return axiosInstance.get(`${PREFIX}/stored/info/${reportId}/${hashCode}`);
};

export const reportDelete = (reportIds) => {
  return axiosInstance.delete(`${PREFIX}`, {
    params: {
      reportIds: reportIds,
    },
  });
};

export const addReport = (obj) => {
  return axiosInstance.post(`${PREFIX}`, obj);
};

export const preGenerationSet = (reports) => {
  return axiosInstance.post(`${PREFIX}/setParameters`, reports);
};

export const saveScheduleReport = (obj) => {
  return axiosInstance.post(`${PREFIX}/schedule`, obj);
};

export const deleteStoredReport = (reportId, langId, hashcode) => {
  return axiosInstance.delete(
    `${PREFIX}/stored/${reportId}/${langId}/${hashcode}`
  );
};

export const loadReportTree = () => {
  return axiosInstance.get(`${PREFIX}/tree`);
};

export const loadParameterData = (reportId, paramName, isDimension) => {
  return axiosInstance.get(
    `${PREFIX}/info/${
      isDimension ? "dimension" : "parameter"
    }/${reportId}/${paramName}`
  );
};

export const updateParameterData = (reportId, paramName, data, isIterator) => {
  const path = isIterator ? "dimension" : "parameter";

  return axiosInstance.put(
    `${PREFIX}/info/${path}/${reportId}/${paramName}`,
    data
  );
};
