import { ReturnStatus } from "./returnManager.type";

export interface Return {
  create: boolean;
  definitionCode: string | null;
  definitionDescription: string | null;
  definitionId: number;
  delay: number;
  delayHour: number;
  delayMinute: number;
  excelTemplate: boolean;
  fiCode: string;
  fiDescription: string;
  fiDescriptionMap: Record<number, string>;
  fiId: number;
  fromDate: number;
  group: boolean;
  id: number | string;
  identifier: number;
  label: string;
  periodId: number;
  periodTypeCode: string;
  periodTypeId: number;
  reg: boolean;
  returnTypeCode: string;
  returnTypeId: number;
  scheduleId: number;
  status: ReturnStatus;
  statusDate: string | null;
  statusDescription: string | null;
  statusId: number;
  toDate: number;
  versionCode: string;
  versionId: number;
  parentRowId: number;
  leaf?: boolean;
  level: number;
  index: number;
  children?: Return[] | null;
}

export interface OverdueReturn {
  address: string;
  definitionCode: string | null;
  delay: number;
  dueDate: number;
  dueDateHour: number;
  dueDateMinute: number;
  fiCode: string;
  fiIdentificationCode: string;
  fiLegalForm: string;
  fiName: string;
  fiType: string;
  fileId: number;
  fileName: string | null;
  fromDate: number;
  name: string;
  periodId: number;
  periodType: string;
  region: string;
  returnVersion: string | null;
  scheduleId: number;
  toDate: number;
  uploadedTime: number | null;
}

export interface ReturnType {
  additional: string;
  code: string;
  key: number;
  name: string;
  id: number;
  count: number;
}
