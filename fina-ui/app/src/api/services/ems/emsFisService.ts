import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { FiType } from "../../../types/fi.type";

export const loadEmsFiTypes = (page: number, limit: number) => {
  return emsInstance.get("fi/type", {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const loadEmsFiTypeChildren = (id: number) => {
  return emsInstance.get(`fi/types/${id}`);
};

export const loadFis = () => {
  return emsInstance.get<PagingType<FiType>>(`fi`);
};

export const loadFiTreeData = () => {
  return emsInstance.get("fi/tree");
};
