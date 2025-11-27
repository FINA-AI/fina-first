import axiosInstance from "../../axios";

const PREFIX = "/fi/history";

export const loadAllBranchHistory = (fiId) => {
  return axiosInstance.get(`${PREFIX}/${fiId}/branch`);
};

export const loadBranchHistory = (branchId) => {
  return axiosInstance.get(`${PREFIX}/branch/${branchId}`);
};

export const loadFiCriminalRecordHistory = (fiId) => {
  return axiosInstance.get(`${PREFIX}/criminalrecords/${fiId}`);
};

export const loadCriminalRecordHistory = (recordId) => {
  return axiosInstance.get(`${PREFIX}/criminalrecord/${recordId}`);
};

export const loadLicenseHistory = (licenseId, page, limit) => {
  return axiosInstance.get(`${PREFIX}/license/${licenseId}`, {
    params: {
      page,
      limit,
    },
  });
};
