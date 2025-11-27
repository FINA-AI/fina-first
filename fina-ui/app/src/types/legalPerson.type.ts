import { CountryDataTypes } from "./common.type";
import {
  BeneficiariesDataType,
  ContactInfoDataType,
  CriminalRecordDataType,
  FiType,
  ManagersDataType,
  SharesDataType,
} from "./fi.type";

export interface LegalPersonDataType {
  identificationNumber: string;
  country: CountryDataTypes | null;
  id: number;
  name: string;
  nameStrId: number;
  metaInfo?: any;
  contactInfo?: ContactInfoDataType;
  criminalRecords: CriminalRecordDataType[];
  beneficiaries: BeneficiariesDataType[];
  shares: SharesDataType[];
  managers: ManagersDataType[];
  registrationNumber?: string;
  bank: boolean;
  fiId: number;
  fiLegalPersonId: number;
  connectionTypes: string[];
  status: string;
  fiType?: FiType;
  residentStatus?: string;
  connections?: string[];
}
