import { returnVersionDataType } from "./returnVersion.type";
import { FiTypeDataType } from "./fi.type";
import {
  ReturnDefinitionTable,
  ReturnDefinitionType,
} from "./returnDefinition.type";
import { MdtNode } from "./mdt.type";
import { PeriodDefinitionType } from "./period.type";

export interface MainMatrixDataType {
  id: number;
  fiTypeModel: FiTypeDataType;
  pattern: string;
  periodType: PeriodDefinitionType;
  returnVersion: returnVersionDataType;
  password?: string | null;
  digitalSignatureCheckEnabled: boolean;
  processEngine: string;
  regFileType: string | undefined;
  enable: boolean;
  inheritedFromRole?: boolean;
}

export interface SubMatrixDataType {
  returnDefinition: ReturnDefinitionType;
  protected: boolean;
  mainMatrix: MainMatrixDataType;
  id: number;
  matrixTableType: string;
  sheetName: string;
}

export interface SubMatrixSaveDataType {
  id?: number;
  returnDefinition?: { id: number } | ReturnDefinitionType;
  protected?: boolean;
  sheetName?: string;
  matrixTableType?: string;
  mainMatrix?: { id: number };
  returnDefinitionName?: string;
}

export interface SubMatrixOptionsDataType {
  afterHeaderRowAmount: number;
  id: number;
  offset?: number;
  startColumn: string;
  startRow: number;
  vctTableEndConditions: VctTableEndConditionsType[];
  vctTableHeader: string;
  definitionTable: ReturnDefinitionTable;
}

export interface VctTableEndConditionsType {
  id?: number;
  column?: string;
  condition?: string;
}

export interface DefinitionTableDataType {
  id: number;
  mdtNodeId: number;
  mdtNodeCode?: string;
  mdtNodeDescription?: string;
  cell: string;
  dataType: string | null;
  isDirty?: boolean;
  node?: MdtNode;
  sequence: number;

  [key: string]: any;
}
