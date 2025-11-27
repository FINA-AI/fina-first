import { SanctionFineType } from "./sanction.type";

export interface EmsFineDataType {
  id: number;
  sanctionId: number;
  syncronized: boolean;
  finePrice: number;
  amount: number;
  description: string;
  fineType: SanctionFineType;
}

export interface EmsFineStatus {
  fineStatus?: any;
  fineSubstatus?: any;
  fineSubstatusAmount?: number;
  fineSubstatusId?: number;
  id?: number;
  note?: string;
  sanctionId?: number;
  time?: any;
  type?: any;
  userId?: string;
  fineSubstatusDesc?: string;
}

export interface EmsFineSubStatus {
  descriptions?: { [key: string]: string };
  hasInput?: boolean;
  label?: string;
  fineSubstatusDesc?: string;
  fineSubstatusId?: number;
  value?: string;
  id?: number;
}
