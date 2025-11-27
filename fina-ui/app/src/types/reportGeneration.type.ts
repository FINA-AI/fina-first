import { ReportParameterType } from "../components/ReportManager/Generate/ParameterTypeNames";

export interface Iterator {
  id: number;
  invalidValues: string[] | null;
  name: string;
  type: ReportParameterType;
  values: string[] | any[];
  vctIteratorInfo: VctIteratorInfo | null;
  key: string;
}

export interface Parameter extends Iterator {}

export interface ReportParams {
  iterators: Iterator[];
  parameters: Parameter[];
  reportId: number;
}

export interface BaseGenerationParameter {
  [key: string]: BaseGenerationParameterValue;
}

export interface BaseGenerationParameterValue extends ReportSchedule {
  generationStepName: string;
  id: number;
  invalidValues: string[] | null;
  key: string;
  name: string;
  selectedRows: any[];
  stepIndex: number;
  type: ReportParameterType;
  values: string[];
  vctIteratorInfo: VctIteratorInfo | null;
  reportId: number;
}

export interface VctIteratorInfo {
  tableName: string;
  groupByDefinitionCode: string;
  aggregateBy: string;
  versionCode: string;
  skipRowCondition: string;
  periodParameter: string | null;
  periodParameterValues: string[];
  aggregateParameter: string | null;
  aggregateValues: string[] | null;
  groupBy: string | null;
  type: ReportParameterType;
  name: string;
}

export interface ReportSchedule {
  scheduleTime: Date | null;
  isChecked: boolean;
  onDemand: boolean;
  notificationsMails: string | null;
  fileStorageLocation: string | null;
  repositoryFolder: any[];
}

export type OffsetItem = { id: number; name: string };
