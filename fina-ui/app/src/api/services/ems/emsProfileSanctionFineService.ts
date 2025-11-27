import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { EmsFineDataType } from "../../../types/emsFineDataType";

const BASE_PATH = "/sanctionFine";

export const loadData = (
  sanctionId: number,
  page: number,
  start: number,
  limit: number
) => {
  return emsInstance.get<PagingType<EmsFineDataType>>(`${BASE_PATH}`, {
    params: {
      sanctionId: sanctionId,
      page: page,
      start: start,
      limit: limit,
    },
  });
};

export const saveSanctionFine = (fine: EmsFineDataType) => {
  return emsInstance.post<PagingType<EmsFineDataType>>(`${BASE_PATH}`, fine);
};
export const updateSanctionFine = (fine: EmsFineDataType, id: number) => {
  return emsInstance.put<PagingType<EmsFineDataType>>(
    `${BASE_PATH}/${id}`,
    fine
  );
};

export const deleteSanctionFine = (id: number) => {
  return emsInstance.delete(`${BASE_PATH}/${id}`);
};
