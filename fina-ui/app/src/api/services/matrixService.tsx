import axiosInstance from "../axios";
import {
  MainMatrixDataType,
  SubMatrixDataType,
  SubMatrixOptionsDataType,
  SubMatrixSaveDataType,
} from "../../types/matrix.type";
import { DefinitionTableDataType } from "../../types/matrix.type";

let PREFIX = "/matrix";

export const loadMainMatrixData = () => {
  return axiosInstance.get<MainMatrixDataType[]>(`${PREFIX}`);
};

export const saveMatrix = (data: MainMatrixDataType) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const deleteMatrix = (id: number) => {
  return axiosInstance.delete(`${PREFIX}/${id}`);
};

export const getSubmatrixOptions = (subMatrixId: number) => {
  return axiosInstance.get<SubMatrixOptionsDataType[]>(
    `subMatrix/table/${subMatrixId}`
  );
};

export const getSubMatrix = (mainMatrixId: number) => {
  return axiosInstance.get<SubMatrixDataType[]>(`/subMatrix/${mainMatrixId}`);
};

export const deleteSubMatrixOption = (subMatrixId: number) => {
  return axiosInstance.delete(`subMatrix/table/${subMatrixId}`);
};

export const updateSubMatrixOption = (
  subMatrixId: number,
  data: SubMatrixOptionsDataType
) => {
  return axiosInstance.put(`subMatrix/table/${subMatrixId}`, data);
};

export const addSubMatrixOption = (
  subMatrixId: number,
  data: SubMatrixOptionsDataType
) => {
  return axiosInstance.post(`subMatrix/table/${subMatrixId}`, data);
};

export const saveSubMatrix = (data: SubMatrixSaveDataType) => {
  return axiosInstance.post(`/subMatrix`, data);
};

export const deleteSubMatrix = (id: number) => {
  return axiosInstance.delete(`/subMatrix/${id}`);
};

export const saveDefinitionTableData = (
  tableId: number,
  data: DefinitionTableDataType[]
) => {
  return axiosInstance.post(`/subMatrix/table/mapping/${tableId}`, data);
};

export const moveNodeMappingItem = (rowId: number, moveUp: boolean) => {
  return axiosInstance.post(`/subMatrix/table/mapping/move/${rowId}`, null, {
    params: {
      moveUp: moveUp,
    },
  });
};

export const getDefinitionTableData = (tableId: number) => {
  return axiosInstance.get<DefinitionTableDataType[]>(
    `/subMatrix/table/mapping/${tableId}`
  );
};

export const deleteDefinitionTableData = (rowId: number) => {
  return axiosInstance.delete<DefinitionTableDataType[]>(
    `/subMatrix/table/mapping/${rowId}`
  );
};

export const deleteDefinitionTableMultiData = (data: number[]) => {
  return axiosInstance.delete(`/subMatrix/table/mapping/`, { data });
};

export const importMatrix = () => {
  return axiosInstance.post(`${PREFIX}/import`);
};
