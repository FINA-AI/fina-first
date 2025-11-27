import {
  CriminalRecordDataType,
  EducationDataType,
  FiConnectionsDataType,
  FiDataType,
  PositionDataType,
  RecommendationDataType,
  SharesDataType,
} from "./fi.type";
import { CountryDataTypes } from "./common.type";

export interface PhysicalPersonDataType {
  id: number;
  name: string;
  nameStrId: number;
  identificationNumber: string;
  passportNumber?: string;
  citizenship?: CountryDataTypes | null;
  status?: string;
  education: EducationDataType[];
  recommendations: RecommendationDataType[];
  criminalRecords: CriminalRecordDataType[];
  shares: SharesDataType[];
  positions: PositionDataType[];
  fiPersonId: number;
  connectionTypes: string[];
  connectedFis: FiDataType[];
  connections: FiConnectionsDataType[];
  residentStatus?: string;
}

export interface ConfigPhysicalPersonDataType {
  connection: FiDataType[];
  citizenship: CountryDataTypes | null;
  id: number;
  identificationNumber: string;
  name: string;
  passportNumber?: string;
  residentStatus?: string;
  status?: string;
}
