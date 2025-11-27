import { VctIteratorInfo } from "./reportGeneration.type";
import { ReportParameterType } from "../components/ReportManager/Generate/ParameterTypeNames";

interface ReportBaseData {
  fileStorageLocation: string | null;
  folder: boolean;
  generatedId: number;
  hashcode: number;
  id: number;
  langId: number;
  level: number;
  notificationMails: string | null;
  onDemand: boolean;
  parentId: number;
  reportCode: string;
  reportId: number;
  reportInfoHashCode: number;
  reportName: string;
  reportType: string | null;
  repositoryFolderName: string | null;
  repositoryNodeId: string | null;
  scheduleTime: string | null;
  status: string | null;
  userId: number;
  userName: string | null;
  children?: ReportBaseData[];
  expanded: boolean;
  leaf?: boolean;
}

export interface StoredRootReport extends ReportBaseData {
  excelTemplate: boolean;
  code: string;
  reportPkModel: StoredReport;
}

export interface ScheduleReport extends ReportBaseData {}

export interface StoredReport {
  code: string;
  description: string;
  hashcode: number;
  parentId: number;
  reportId: number;
  reportType: string;
}

export interface StoredReportGridData {
  id: number;
  invalidValues: string[];
  name: string;
  dimensionType: string;
  type: ReportParameterType;
  value: string[];
  values: string[];
  vctIteratorInfo: VctIteratorInfo | null;
}

export interface Report {
  code: string;
  description: string;
  expanded: boolean;
  hasSomeChildrenSelected: boolean;
  id: number;
  info: string | null;
  langId: number;
  leaf: boolean;
  level: number;
  nameStrId: number;
  parentId: number;
  reportType: string;
  rolePermission: boolean;
  sequence: number;
  type: number;
  userPermission: boolean;
  version: number;
  editMode?: boolean;
  children: Report[];
  hashcode: number;
}

export interface ReportStatistic {
  count: number;
  generateDate: number;
  hashcode: number;
  id: number;
  langId: number;
  reportName: string | null;
  userName: string;
}

export interface ParameterRestriction {
  restrictedCodes: string[];
  restrictedCount: number;
}
