import { MdtNode } from "./mdt.type";

export interface ReturnDefinitionType {
  id: number;
  code: string;
  disabled?: boolean;
  generalInfo: string;
  hasReturnDefinition: boolean;
  manualInput: boolean;
  name: string;
  returnType: ReturnType;
  userRoleReturnDefinition: boolean;
  version: number;
  tables: ReturnDefinitionTable[];
  disable?: boolean;
}

export interface ReturnType {
  code: string;
  editable: boolean;
  id: number;
  name: string;
  version: number;
  excelTemplate: boolean;
}

export interface ReturnDefinitionTable {
  code: string;
  id: number;
  type: string;
  tempId?: number;
  node: MdtNode;
  name: string;
  evalType: string;
  manualInput?: string;
  returnDefinition?: Partial<ReturnDefinitionType>;
  visibleLevel: number;
  sequence: number;
}

export interface ReturnReportPrintObjectType {
  versionId?: number;
  definition?: number;
  fiIds?: number;
  returnTypeIds?: number[];
  fiGroupId?: number;
  fiTypeIds?: number[];
  periodId?: number;
}

export interface GeneratedRDTable {
  fileName: string;
  stringSource: string;
  source: {
    [key: string]: string;
  };
  type: string;
}
