import { SanctionType } from "./sanction.type";
import { EmsFineStatus } from "./emsFineDataType";
import { FiType } from "./fi.type";

export interface EmsFiProfileInspectionType {
  id: number;
  fiId: number;
  fiCode: string;
  fiName: string;
  documentNumber: string;
  documentDate: number;
  creationTime: number;
  inspectionPeriodStart: number;
  inspectionPeriodEnd: number;
  inspectedPeriodStart: number;
  inspectedPeriodEnd: number;
  decreeNumber: string;
  decreeDate: number;
  recommendationMailSent: boolean;
  types: [];
  inspectors: InspectorDataType[];
  status: {
    id: number;
    inspectionId: number;
    note: string;
    time: number;
    userId: string;
    type: string;
  };
  totalPrice: number;
  documents: any;
  violations: ViolationType[];
  reclamationLetterNumber?: number;
  reclamationLetterDate?: number;
  recommendation: string;
  inspectionSubject: string;
  syncronized: boolean;
  fi?: FiType;
  note?: string;
}

export interface EmsFiProfileSanctionType {
  administratorIdNumber: string;
  administratorName: string;
  deliveryDate: any;
  documentNumber: string;
  documentTime: any;
  documents: [];
  dueDate: number;
  id: number;
  inspectionId: number;
  paymentDate: any;
  responsiblePerson: string;
  sanctionFines: [];
  syncronized: boolean;
  totalPrice: number;
  type: SanctionType;
  status: EmsFineStatus;
}

export interface InspectorDataType {
  login: string;
  description: string;
  titleDescription: string | null;
}

export interface TypeFieldInspectionType {
  id?: number;
  description?: string;
  name?: string;
  descriptions?: string;
  names?: string;
}

export interface ViolationType {
  id?: number;
  violation: string;
  violationDate?: number;
  comment?: string;
}
