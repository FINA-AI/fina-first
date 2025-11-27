import { emsInstance } from "../../axios";

export const inspectionFilter = (query: string) => {
  return emsInstance.post("filter", {
    sql: query,
  });
};

export const loadAdvancedFilterParams = () => {
  return emsInstance.get("filter");
};
