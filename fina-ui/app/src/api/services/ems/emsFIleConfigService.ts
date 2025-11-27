import { emsInstance } from "../../axios";
import {
  EmsFileConfigurationDetailDataType,
  FineType,
} from "../../../types/emsFileConfiguration.type";
import { EmsFileConfigDataTypes } from "../../../types/inspection.type";

export const loadEmsConfig = () => {
  return emsInstance.get<EmsFileConfigDataTypes[]>("file/configuration");
};

export const postEmsConfig = (data: FormData) => {
  return emsInstance.post("file/configuration", data);
};

export const deleteEmsConfig = (id: number) => {
  return emsInstance.delete(`file/configuration/${id}`);
};

export const getEmsConfigDetails = (id: number) => {
  return emsInstance.get<EmsFileConfigurationDetailDataType[]>(
    `file/configuration/attribute/${id}`
  );
};

export const getEmsConfigDetailCellObjects = (id: number) => {
  return emsInstance.get<{ name: string; type: string }[]>(
    `file/configuration/attribute/field/${id}`
  );
};

export const getEmsConfigDetailSanctionFineTypes = () => {
  return emsInstance.get<{ list: FineType[] }>(`sanctionFineType`, {
    params: {
      page: 1,
      limit: 1000,
    },
  });
};

export const postEmsConfigDetail = (
  data: EmsFileConfigurationDetailDataType
) => {
  return emsInstance.post(`file/configuration/attribute`, data);
};

export const deleteAtribute = (id: number) => {
  return emsInstance.delete(`file/configuration/attribute/${id}`);
};

export const putAtribute = (data: EmsFileConfigurationDetailDataType) => {
  return emsInstance.put(`file/configuration/attribute`, data);
};
