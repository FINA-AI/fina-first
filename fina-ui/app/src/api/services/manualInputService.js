import axiosInstance from "../axios";

const PREFIX = "/mi";

export const loadMiInfo = (returnId, versionId) => {
  return axiosInstance.get(`${PREFIX}/return/${returnId}/${versionId}`, {
    timeout: 1000 * 60 * 5,
  });
};

export const insertRow = (body, maxRowNumber) => {
  return axiosInstance.post(
    `${PREFIX}/return/data/insertRow/${maxRowNumber}`,
    body
  );
};

export const deleteRow = (body, maxRowNumber) => {
  return axiosInstance.post(
    `${PREFIX}/return/data/deleteRow/${maxRowNumber}`,
    body
  );
};

export const saveAndProcessReturn = (tables, returnId, versionId, note) => {
  return axiosInstance.post(
    `${PREFIX}/return/data/updaterReturnItems/${returnId}/${versionId}`,
    tables,
    {
      timeout: 0,
      params: {
        note: note,
      },
    }
  );
};
