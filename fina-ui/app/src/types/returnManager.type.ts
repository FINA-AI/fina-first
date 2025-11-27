export interface ReturnStatusType {
  fiCode: string;
  fiDescription: string;
  fromDate: string;
  id: number;
  note: string;
  returnCode: string;
  returnDescription: string;
  status: string;
  statusDate: number;
  toDate: string;
  user: string;
}

export interface ImportedXML {
  id: number;
  importTime: number;
  importModel: {
    id: number;
    fileName: string;
    uploadTime: number;
    status: string;
  };
}

export enum ReturnStatus {
  STATUS_SCHEDULED = "STATUS_SCHEDULED",
  STATUS_CREATED = "STATUS_CREATED",
  STATUS_AMENDED = "STATUS_AMENDED",
  STATUS_IMPORTED = "STATUS_IMPORTED",
  STATUS_PROCESSED = "STATUS_PROCESSED",
  STATUS_VALIDATED = "STATUS_VALIDATED",
  STATUS_RESETED = "STATUS_RESETED",
  STATUS_ACCEPTED = "STATUS_ACCEPTED",
  STATUS_REJECTED = "STATUS_REJECTED",
  STATUS_ERRORS = "STATUS_ERRORS",
  STATUS_LOADED = "STATUS_LOADED",
  STATUS_QUEUED = "STATUS_QUEUED",
}

export interface ProcessedResult {
  id: number;
  processNote: string;
  returnDefinitionCode: string;
  returnId: number;
  status: ReturnStatus;
}
