import axiosInstance from "../axios";

const PREFIX = "/tools";

export const getPackages = () => {
  return axiosInstance.get(`${PREFIX}/ost/package`);
};

export const deletePackage = (pacakgeId) => {
  return axiosInstance.delete(`${PREFIX}/ost/package/${pacakgeId}`);
};

export const saveReleaseMdt = (data) => {
  return axiosInstance.post(`${PREFIX}/releaseMdt`, data);
};

export const saveMDTToXML = (data) => {
  return axiosInstance.post(
    `${PREFIX}/mdtToXml/${data.definitionCode}`,
    data.body,
    {
      params: {
        folderLocation: data.folderLocation,
        allReturns: data.allReturns,
      },
    }
  );
};

export const postReturnToXML = (data) => {
  return axiosInstance.post(`${PREFIX}/returnToXml/${data.languageCode}`, {
    fromDate: data.fromDate,
    toDate: data.toDate,
    folderLocation: data.folderLocation,
  });
};

export const decrypt = (data, isLegacyCertificateMode) => {
  const url = isLegacyCertificateMode ? "legacy" : "";
  return axiosInstance.post(`${PREFIX}/decrypt/${url}`, data, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const postPackage = (data) => {
  return axiosInstance.post(`${PREFIX}/ost/package`, data);
};

export const loadToolFiTypes = () => {
  return axiosInstance.get(`${PREFIX}/fiTypes`);
};
