import { emsInstance } from "../../axios";

export const loadProfileSanctions = (
  page: number,
  start: number,
  limit: number,
  inspectionId: number
) => {
  return emsInstance.get("sanction", {
    params: {
      inspectionId,
      page: page,
      start: start,
      limit: limit,
    },
  });
};

export const loadSanctionStatusTypes = (
  page: number,
  start: number,
  limit: number
) => {
  return emsInstance.get("sanction/statusType", {
    params: {
      page: page,
      start: start,
      limit: limit,
    },
  });
};

export const loadFineStatus = (page: number, start: number, limit: number) => {
  return emsInstance.get("sanction/fineStatusType", {
    params: {
      page: page,
      start: start,
      limit: limit,
    },
  });
};

export const postSanction = (inspectionId: number | null, data: any) => {
  return emsInstance.post("sanction", data, {
    params: {
      inspectionId,
    },
  });
};

export const updateSanction = (inspectionId: number | null, data: any) => {
  return emsInstance.put(`sanction/${data.id}`, data, {
    params: {
      inspectionId,
    },
  });
};

export const deleteSanction = (inspectionId: number, id: number) => {
  return emsInstance.delete(`sanction/${id}`, {
    params: {
      inspectionId,
    },
  });
};

export const uploadSanctionDocument = (
  data: FormData | null,
  fiCode: string,
  sanctionId: number | undefined
) => {
  return emsInstance.post(`sanction/documents/${fiCode}/${sanctionId}`, data);
};

export const loadSanctionDocument = (
  fiCode: string,
  sanctionId: number | undefined
) => {
  return emsInstance.get(`sanction/documents/${fiCode}/${sanctionId}`);
};

export const deleteSanctionDocument = (id: number | string) => {
  return emsInstance.delete(`ecm/file/${id}`);
};

export const loadFineStatusType = (fineStatus: string) => {
  return emsInstance.get(`sanction/fineStatusType/${fineStatus}`);
};
