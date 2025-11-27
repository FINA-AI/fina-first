import { emsInstance } from "../../axios";
import {
  EmsFiProfileInspectionType,
  InspectorDataType,
} from "../../../types/emsFiProfile.type";
import { PagingType } from "../../../types/common.type";

export const loadProfileInspectionStatusType = () => {
  return emsInstance.get<PagingType<string>>("inspection/statusType");
};

export const loadProfileInspectionDocument = (
  fiCode: string,
  inspectionId: number
) => {
  return emsInstance.get(`inspection/documents/${fiCode}/${inspectionId}`);
};

export const postProfileInspectionDocument = (
  fiCode: string,
  inspectionId: number | undefined,
  data: FormData
) => {
  return emsInstance.post(
    `inspection/documents/${fiCode}/${inspectionId}`,
    data
  );
};

export const loadInspectors = () => {
  return emsInstance.get<PagingType<InspectorDataType>>(
    "inspection/inspectors"
  );
};

export const postProfileInspection = (data: EmsFiProfileInspectionType) => {
  return emsInstance.post("inspection", data);
};

export const putProfileInspection = (
  id: number,
  data: EmsFiProfileInspectionType
) => {
  return emsInstance.put(`inspection/${id}`, data);
};

export const deleteProfileInspection = (id: number) => {
  return emsInstance.delete(`inspection/${id}`);
};
