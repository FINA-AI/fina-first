import { LegalPersonDataType } from "./legalPerson.type";
import { PhysicalPersonDataType } from "./physicalPerson.type";
import { CountryDataTypes } from "./common.type";
import { UserType } from "./user.type";

export interface FiType {
  id: number;
  code: string;
  name: string;
  checked: boolean;
  active?: boolean;
  address?: string;
  email?: string;
  fax?: string;
  fiType?: string;
  leaf?: boolean;
  phone?: string;
  regionalAddress: any;
  level?: number;
}

export interface FiTypeDataType {
  id: number;
  code?: string;
  version?: number;
  nameStrId?: number;
  name?: string;
  fis?: any;
  descriptionModel?: null | string;
  activeFisCount?: number;
  inactiveFisCount?: number;
}

interface FiImportWrapper {
  importResult: FiImportResult;
  percentage: number;
}

export interface FiImportResult {
  importedFis: string[];
  modifiedFis: string[];
  notImportedFis: string[];
  nonExistentTypes: string[];
  nonExistentLicenseTypes: string[];
  nonExistentGroups: string[];
  nonExistentManagements: string[];
  nonExistentRegions: string[];
  nonExistentLanguages: string[];
  nonExistentLicenses: string[];
  exceptions: undefined;
  exceptionMessages: string[];
}

enum WsFiEventType {
  IMPORT,
}

export interface FiImportEventType {
  fiImportWrapper: FiImportWrapper;
  type?: WsFiEventType;
  userLogin: string;
}

export interface FiGroupModelType {
  id: number;
  version?: number;
  code?: string;
  nameStrId: number;
  name?: string;
  parentId: number;
  type: "PARENT" | "CHILD";
  isDefault: boolean;
  edited: boolean;
}

export interface EducationDataType {
  id: number;
  instituteName: string;
  instituteNameStrId: number;
  educationLevel: string;
  speciality: string;
  specialityStrId: number;
  completeCourseName?: string;
  completeCourseNameStrId: number;
  seminarOrganizer: string;
  seminarOrganizerStrId: number;
  trainingPlace?: string;
  trainingPlaceStrId: number;
  completionDate?: number;
  certificates: boolean;
  supportDocuments?: string;
  supportDocumentsStrId: number;
  academicDegreeLevel: string;
}

export interface RecommenderDataType {
  id: number;
  name: string;
  nameStrId: number;
  identificationNumber: string;
  passportNumber: string;
  citizenship?: string;
  status?: string;
  education: EducationDataType[];
  recommendations: RecommendationDataType[];
  criminalRecords: CriminalRecordDataType[];
  shares: SharesDataType[];
  positions: any[];
  fiPersonId: number;
  connectionTypes: any[];
  connectedFis: any[];
  connections: any[];
  residentStatus?: string;
}

export interface RecommendationDataType {
  id: number;
  recommender: RecommenderDataType;
  identificationNumber?: string;
  passportNumber: string;
  recommendationDate: number;
  recommenderWorkspace: string;
  recommenderWorkspaceStrId: number;
  cooperationPlace: string;
  cooperationPlaceStrId: number;
  phone: string;
}

export interface CriminalRecordDataType {
  id: number;
  courtDecisionNumber: string;
  courtDecisionDate: number;
  courtDecision: string;
  courtDecisionNameStrId: number;
  punishmentDate: number;
  type: string;
  typeStrId: number;
  fineAmount: number;
  punishmentStartDate: number;
  currency?: string;
}

export interface PositionDataType {
  id: number;
  company: LegalPersonDataType;
  person: PhysicalPersonDataType;
  position: string;
  positionStrId: number;
  electionDate: number;
}

export interface ContactInfoDataType {
  id: number;
  citizenship: CountryDataTypes;
  address: string;
  phone: string;
  webSite?: string;
}

export interface SharesDataType {
  id: number;
  company?: LegalPersonDataType;
  shareDate: number;
  sharePercentage: number;
}

export interface FiConnectionsDataType {
  connectionType: string;
  fiBeneficiaries: BeneficiariesDataType[];
  fiBranchPositions: any[];
  fiManagements: ManagementDataType[];
  name: string;
  personPositions: PositionDataType[];
  personShares: SharesDataType[];
  status?: string;
}

export interface ManagersDataType {
  id: number;
  person?: PhysicalPersonDataType;
  company?: LegalPersonDataType;
  electionDate?: any;
  position?: any;
  positionStrId?: number;
  name?: string;
  identificationNumber?: number;
}

export interface FiGroupModel {
  id: number | string;
  version: number;
  code: string;
  nameStrId: number;
  name: string;
  parentId: number;
  type: string;
  isDefault: boolean;
  edited: boolean;
  leaf: boolean;
  export: boolean;
  level: number;
  children: FiGroupModel[];
}

export interface LegalFormEntityInfo {
  id: number;
  code: string;
  description: string;
  nameStrId: number;
}

export interface AdditionalInfoType {
  id: number;
  businessEntity?: LegalFormEntityInfo;
  economicEntity?: LegalFormEntityInfo;
  equityForm?: LegalFormEntityInfo;
  managementForm?: LegalFormEntityInfo;
}

export interface FiDataType {
  id: number;
  version: number;
  code: string;
  nameStrId: number;
  name: string;
  shortNameStrId: number;
  shortNameString: string;
  addressStrId: number;
  addressString: string;
  phone: string;
  fax: string;
  email: string;
  swiftCode: string;
  regionId: number;
  region: CountryDataTypes;
  identificationCode: string;
  legalForm: string;
  fiTypeModel: FiTypeDataType;
  fiGroupModels: FiGroupModel[];
  userLoginModels?: any;
  permittedUserIds?: number[];
  hasFiModel: boolean;
  halfChecked: boolean;
  level: number;
  disable: boolean;
  descriptionModel: {
    nameStrId: number;
    langId: number;
    description: string;
  };
  contactPerson?: string;
  createdAt?: number;
  modifiedAt: number;
  registrationDate?: number;
  closeDate?: number;
  numberOfMobileOffices: number;
  reorganization?: any;
  representativePerson: string;
  webSite?: string;
  numberOfEmploys: number;
  branchTypeCounterList?: {
    count: number;
    name: string;
  }[];
  additionalInfo: AdditionalInfoType;
  decreeNumber?: string;
  inspectionEndDate?: number;
  shares: SharesDataType[];
  criminalRecords: CriminalRecordDataType[];
  roleFi: boolean;
  licenseCode?: string;
}

//=========================================== FI License

export interface LicenseOperationType {
  id: number;
  parentId: number;
  code: string;
  description: string;
  descriptionStrId: number;
  nationalCurrency: boolean;
  foreignCurrency: boolean;
  licenseTypeId: number;
  children: any[];
  comments?: any;
}

export interface LicensesDataType {
  id: number;
  code: string;
  version: number;
  creationDate?: number;
  dateOfChange?: string;
  licenceStatus: string;
  reasonStrId: number;
  reason?: string;
  change?: string;
  isDefault: boolean;
  licenseType: LicenseType;
  fiModel: FiDataType;
  operations: LicenseOperationType[];
  allBankingOperations: BankingOperationsDataType[];
  comments: any[];
  default: boolean;
}

export interface LicenseType {
  id: number;
  code: string;
  version: number;
  nameStrId: number;
  name: string;
  operations: LicenseOperationType[];
}

export interface BankingOperationsDataType {
  id: number;
  parentId: number;
  code: string;
  description: string;
  descriptionStrId: number;
  nationalCurrency: boolean;
  foreignCurrency: boolean;
  licenseTypeId: number;
  children: BankingOperationsDataType[];
  restrictive?: any;
  bankingOperation?: any;
  comments?: any;
}

export interface CommentType {
  id: number;
  comment: string;
  modifiedAt: string | null | undefined;
}

export interface LicenseHistoryDataType {
  entity: {
    id: number;
    code: string;
    version?: number;
    creationDate: number;
    dateOfChange: number;
    licenceStatus: string;
    reasonStrId: number;
    reason?: string;
    change?: string;
    isDefault: boolean;
    licenseType: any;
    fiModel: any;
    operations: any[];
    allBankingOperations: BankingOperationsDataType[];
    comments: any[];
    default: boolean;
  };
  modifiedAt: number;
  revisionNumber: number;
  modifiedBy: string;
  revisionType: string;
}

//=========================================== FI Branch

export interface BranchDataType {
  id: number;
  createDate?: number;
  changeDate?: number;
  bankId: number;
  version: number;
  nameStrId: number;
  name: string;
  shortNameStrId: number;
  shortName: string;
  addressStrId: number;
  address: string;
  commentStrId: number;
  comment: string;
  disable: boolean;
  closeDate?: number;
  suspensionDate?: number;
  renewalDate?: number;
  email: string;
  phone: string;
  registrationNumber: string;
  code: string;
  regionModel: CountryDataTypes;
  region: number;
  fiBranchTypeId: number;
  fiBranchTypeName: string;
  manager?: string;
  managerAppointmentDate?: number;
  chiefAccountant?: string;
  chiefAccountantAppointmentDate?: number;
  deleted: boolean;
  storageAvailable: boolean;
  isStorageAvailable: boolean;

  [key: string]: any;
}

export interface BranchColumnType {
  index: number;
  key: string;
  type: string;
}

export interface BranchStepType {
  index: number;
  name: string;
  nameStrId: number;
  columns: BranchColumnType[];
}

export interface BranchTypes {
  name: string;
  additional?: string;
  count: number;
  key?: number;
  config?: BranchColumnType[];
  steps: BranchStepType[];
  code: string;
  id?: number;
  nameStrId?: number;
  version?: number;
}

//=========================================== FI Management

export interface FiManagementType {
  id: number;
  code: string;
  name: string;
  key?: number;
  is?: any;
  steps: {
    index: number;
    name: string;
    nameStrId: number;
    columns: {
      index: number;
      key: string;
      type: string;
    }[];
  }[];
  nameStrId?: number;
  version?: number;
}

export interface ManagementDataType {
  id: number;
  version: number;
  fiId: number;
  firstName?: string;
  firstNameStrId: number;
  lastName?: string;
  lastNameStrId: number;
  resident: boolean;
  disable: boolean;
  postString?: string;
  postStrId: number;
  registrationId1String?: string;
  registrationId1StrId: number;
  registrationId2String?: string;
  registrationId2StrId: number;
  registrationId3String?: string;
  registrationId3StrId: number;
  commentId1String?: string;
  commentId1StrId: number;
  commentId2String?: string;
  commentId2StrId: number;
  phone?: string;
  appointmentDate?: number;
  cancelDate?: number;
  managementModel?: any;
  mail?: string;
  address?: string;
  dependencyStatus: boolean;
  person?: PhysicalPersonDataType;
  fiPersonId: number;
  committeeList: any[];
  position?: string;
  numberOfReportingEmployees: number;
  dateOfApproval?: number;
  portfolio?: any;
}

//=========================================== FI Beneficiaries

export interface BeneficiariesDataType {
  active: boolean;
  creationDate: number;
  currency?: string;
  finalBeneficiaries: BeneficiariesDataType[];
  id: number;
  legalPerson?: LegalPersonDataType;
  nominal: number;
  physicalPerson?: PhysicalPersonDataType;
  share: number;
  dependencyType?: string;
  identificationNumber?: number;
  person?: PhysicalPersonDataType;
  index?: number;
  sharePercentage?: number;
  errors?: {
    [key: string]: boolean;
  };
  name?: string;
  newRow?: boolean;
}

export interface BeneficiaryType {
  additional: string;
  key: string;
  name: string;
}

//=========================================== FI Structure

export interface FiStructureDataType {
  id: number;
  version: number;
  code: string;
  nameStrId: number;
  name: string;
  parentId: number;
  type: string;
  isDefault: boolean;
  edited: boolean;
}

//=========================================== FI Permitted User

export interface GroupAndUsersDataType {
  children?: GroupAndUsersDataType[];
  code: string;
  description: string;
  group: boolean;
  id: number;
  leaf: boolean;
  level: number;
  parentId: number;
  users?: UserType[];
  opened?: boolean;
  login: string;
}

//=========================================== FI Criminal Record

export interface FICriminalRecordHistoryDataType {
  entity: CriminalRecordDataType;
  modifiedAt: number;
  modifiedBy: string;
  revisionNumber: number;
  revisionType: string;
}

//=========================================== FI Other Shares

export interface OtherSharesDataType {
  children: ShareType[];
  company: LegalPersonDataType;
  id: number;
  leaf: boolean;
  parentId: number;
  share: number;
  shareDate: number;
  shares: SharesDataType[];
  level?: number;
}

export interface ShareType {
  id: number;
  parentId: number;
  children: any[];
  share: number;
  shareDate: number;
}

//=========================================== FI Configuration - Regional Structure

export enum ResidentStatusOptionEnum {
  PHYSICAL_PERSONS_RESIDENT = "PHYSICAL_PERSONS_RESIDENT",
  PHYSICAL_PERSONS_NO_RESIDENT = "PHYSICAL_PERSONS_NO_RESIDENT",
  SOLE_PROPRIETOR_RESIDENT = "SOLE_PROPRIETOR_RESIDENT",
  SOLE_PROPRIETOR_NO_RESIDENT = "SOLE_PROPRIETOR_NO_RESIDENT",
  LEGAL_ENTITY_RESIDENT = "LEGAL_ENTITY_RESIDENT",
  LEGAL_ENTITY_NO_RESIDENT = "LEGAL_ENTITY_NO_RESIDENT",
}
