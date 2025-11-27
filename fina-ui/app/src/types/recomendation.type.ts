export interface recomendationDataType {
  id?: number;
  creationDate?: string;
  deliveryDate?: string;
  executionDate?: string;
  status?: string;
  reason?: string;
  userId?: string;
  inspectionId?: number;
  type?:
    | {
        id?: number;
        type?: string;
        names?: Record<string, string>;
      }
    | string;
  fineStatus?: string;
  fiCode?: string;
  fiName?: string;
  inspectionDocumentNumber?: string;
}

export interface recommendationFilterType {
  deliveryDateFrom?: string;
  deliveryDateTo?: string;
  executionDateFrom?: string;
  executionDateTo?: string;
  fiIds?: number[];
  status?: string[];
  type?: number;
}
