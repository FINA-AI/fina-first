import axiosInstance from "../../axios";

export const loadCriminalRecords = (fiId) => {
  return axiosInstance.get(`/fi/criminalrecords/${fiId}/`, {
    params: {
      fiId: fiId,
    },
  });
};

export const addCriminalRecord = (fiId, criminalRecord) => {
  return axiosInstance.post(`/fi/criminalrecords/${fiId}/`, criminalRecord);
};

export const editCriminalRecord = (fiId, criminalRecord) => {
  return axiosInstance.put(`/fi/criminalrecords/${fiId}/`, criminalRecord);
};

export const deleteCriminalRecord = (fiId, criminalRecordId) => {
  return axiosInstance.delete(
    `/fi/criminalrecords/${fiId}/${criminalRecordId}`,
    {
      params: {
        fiId: fiId,
        recordId: criminalRecordId,
      },
    }
  );
};
