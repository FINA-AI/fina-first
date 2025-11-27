import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { InspectionType } from "../../../types/inspection.type";

export const loadInspectionTypes = (page: number, limit: number) => {
  return emsInstance.get<PagingType<InspectionType>>("inspectionType", {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const postInspectionTypes = (data: InspectionType) => {
  return emsInstance.post("inspectionType", data);
};

export const updateInspectionTypes = (id: number, data: InspectionType) => {
  return emsInstance.put(`inspectionType/${id}`, data);
};

export const deleteInspectionTypes = (id: number) => {
  return emsInstance.delete(`inspectionType/${id}`);
};

export const loadInspectionStatus = (
  page: number,
  limit: number,
  id: number
) => {
  return emsInstance.get("/inspection/status", {
    params: {
      page: page,
      limit: limit,
      inspectionId: id,
    },
  });
};

export const loadInspections = (page: number, limit: number, search: any) => {
  return emsInstance.get<PagingType<InspectionType>>("inspection", {
    params: {
      page: page,
      limit: limit,
      ...search,
    },
  });
};
