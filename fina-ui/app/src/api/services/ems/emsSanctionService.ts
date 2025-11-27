import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { SanctionFineType, SanctionType } from "../../../types/sanction.type";

export const loadSanctionTypes = (page: number, limit: number) => {
  return emsInstance.get<PagingType<SanctionType>>("sanctionType", {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const postSanctionTypes = (data: SanctionType) => {
  return emsInstance.post("sanctionType", data);
};

export const updateSanctionTypes = (id: number, data: SanctionType) => {
  return emsInstance.put(`sanctionType/${id}`, data);
};

export const deleteSanctionTypes = (id: number | undefined) => {
  return emsInstance.delete(`sanctionType/${id}`);
};

export const getSanctionTypesList = () => {
  return emsInstance.get("sanctionType/types");
};
export const loadSanctionFineType = (
  page: number,
  limit: number,
  fiType?: string,
  fiCode?: string
) => {
  return emsInstance.get<PagingType<SanctionFineType>>("sanctionFineType", {
    params: {
      page: page,
      limit: limit,
      fiType: fiType,
      fiCode: fiCode,
    },
  });
};

export const deleteSanctionFine = (id: number, data?: SanctionFineType) => {
  return emsInstance.delete(`sanctionFineType/${id}`, { data });
};

export const postSanctionFine = (obj: SanctionFineType) => {
  return emsInstance.post("sanctionFineType", obj);
};

export const updateSanctionFine = (id: number, obj: SanctionFineType) => {
  return emsInstance.put(`sanctionFineType/${id}`, obj);
};

export const loadSanctionStatuses = (
  page: number,
  limit: number,
  sanctionId: number
) => {
  return emsInstance.get("/sanction/status", {
    params: { page, limit, sanctionId },
  });
};
