import { emsInstance } from "../../axios";
import { InspectionColumnData } from "../../../types/inspection.type";

export const loadInspectionColumns = () => {
  return emsInstance.get<InspectionColumnData[]>("inspectionColumn");
};

export const loadInspectionColumnTypes = () => {
  return emsInstance.get<string[]>("inspectionColumn/types");
};

export const postInspectionColumn = (data: InspectionColumnData) => {
  return emsInstance.post("inspectionColumn", data);
};

export const deleteInspectionColumn = (id: number) => {
  return emsInstance.delete(`inspectionColumn/${id}`);
};

export const putInspectionColumn = (data: InspectionColumnData) => {
  return emsInstance.put(`inspectionColumn/${data.id}`, data);
};
