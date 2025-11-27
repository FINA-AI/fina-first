import { FiType } from "./fi.type";

export interface SanctionType {
  id: number;
  names: Record<string, string>;
  type: string;
}

export interface SanctionDataType {
  id?: number;
  name: string;
  type: string;
  syncronized?: boolean;
}
export interface SanctionFineType {
  id: number;
  names: {
    [key: string]: string;
  };
  rule: string;
  article: string;
  paragraph: string;
  subParagraph: string;
  price: number[];
  fiType: string | FiType;
  description?: string;
  metaDescription?: string;
}
export interface EmsSanctionStatusHistoryType {
  id: number;
  sanctionId: number;
  note: string;
  time: Date;
  userId: string;
  type: SanctionStatusTypeEnum;
  fineStatus: SanctionFineStatusTypeEnum;
  fineSubstatusId: number | null;
  fineSubstatus: SanctionFineSubstatusModel | null;
  fineSubstatusAmount: number | null;
}
enum SanctionStatusTypeEnum {
  IMPOSED = "IMPOSED",
  FULFILLED = "FULFILLED",
  DONE = "DONE",
}

enum SanctionFineStatusTypeEnum {
  IMPOSED = "IMPOSED",
  APPEALED = "APPEALED",
  PAID = "PAID",
  UNPAID = "UNPAID",
  ANNULLED = "ANNULLED",
}

export interface SanctionFineSubstatusModel {
  id: number;
  descriptions: { [key: string]: string };
  inputDescriptions: { [key: string]: string };
  hasInput: boolean;
}
