import { FiDataType, FiType } from "./fi.type";

export interface FiTree {
  parent: FiType;
  fis: FiDataType[];
}
