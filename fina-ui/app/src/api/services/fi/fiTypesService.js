import axiosInstance from "../../axios";

export const loadFiTypes = () => {
  return axiosInstance.get("/fi/types");
};

export const addFiType = (fiType) => {
  return axiosInstance.post("/fi/types", fiType);
};

export const editFiType = (fiType) => {
  return axiosInstance.post("/fi/types", fiType);
};

export const deleteFiType = (fiTypeId) => {
  return axiosInstance.delete(`/fi/types/${fiTypeId}`, {
    params: { id: fiTypeId },
  });
};
