import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { fileImportDataType } from "../../../types/fileImport.type";

export const loadData = (page: number, limit: number) => {
  return emsInstance.get<PagingType<fileImportDataType>>("/file/import", {
    params: {
      page: page,
      limit: limit,
    },
  });
};

export const importFile = (data: FormData) => {
  return emsInstance.post("file/import", data);
};
