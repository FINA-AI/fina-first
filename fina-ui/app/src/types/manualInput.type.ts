import { Comparison } from "./comparison.type";

export interface MiData {
  returnId: number;
  status: string;
  statusName: string;
  versionId: number;
  versionCode: string;
  versionDescription: string;
  periodId: number;
  fromDate: number;
  toDate: number;
  periodTypeCode: string;
  periodTypeDescription: string;
  fiId: number;
  fiCode: string;
  fiDescription: string;
  definitionId: number;
  returnCode: string;
  returnDescription: string;
  returnTypeCode: string;
  userLogin: string;
  userName: string;
  tables: MiTable[];
  comparisons: Comparison[];
  dependencies: any[];
  dependentNodes: {
    dependentNodeId: number;
    nodeId: number;
  }[];
  itemsByCodesMap: MiItemsByCodesMap;
  codeByIdMap: Record<string, string>;
  readonly: boolean;
}

export interface MiTable {
  id: number;
  tempId?: number;
  tableId: number;
  description: string;
  type: string;
  evalMethod: string | null;
  sequence: number;
  visibleLevel: number;
  rows: MiTableRow[];
}

export interface MiTableRow {
  rowItems: MiTableRowItem[];
}

export interface MiTableRowItem {
  id: number;
  returnId: number;
  versionId: number;
  tableId: number;
  nodeId: number;
  rowNumber: number;
  value: string | number | null;
  nvalue: number | string;
  nodeType: number;
  tableType: number;
  equation: string;
  code: string;
  tableEvalMethod: string | null;
  nodeEvalMethod: string;
  dataType: string;
  parentId: number;
  description: string;
  listElementValues: MiTableRowItem[];
  dataItemValue: null | number | string;
  sequence: number;
  itemNotInDatabase: boolean;
  dependentNodeIds: number[];
  usedByNodeIds: number[];
  processMessage?: { message: string; comparisonError: boolean };
  isNotNumber?: boolean;
  column?: string;
  row: string;
  name: string;
}

export type MiItemsByCodesMap = Record<string, Record<number, MiTableRowItem>>;

export interface MiProcess {
  returnCode: string;

  recalculate(inputItem: MiTableRowItem, table: MiTable, _setTable?: any): void;

  recalculateAll(): void;
}

export interface MiTableColumn {
  dataKey: string;
  label?: string;
  numeric?: boolean;
  width: number;
  minWidth?: number;
  flexGrow?: number;
}

export type MiTableType = "MCT" | "VCT";
