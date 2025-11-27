import axiosInstance from "../axios";

export const loadSurvey = (start, limit, sortField, sortDir) => {
  return axiosInstance.get(`survey`, {
    params: {
      start,
      limit,
      sortField,
      sortDir,
    },
  });
};

export const getSurvey = (surveyName, isPublic) => {
  return axiosInstance.get(`survey/${surveyName}?isPublic=${isPublic}`);
};

export const uploadSurvey = (file, isPublicUpload) => {
  return axiosInstance.post(
    `survey/upload?isPublicUpload=${isPublicUpload}`,
    file,
    {
      timeout: 0,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
