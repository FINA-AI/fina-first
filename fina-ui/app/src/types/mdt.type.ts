import { Comparison } from "./comparison.type";

export interface MdtNode {
  id: number;
  version: number;
  code: string;
  nameStrId: number;
  name: string;
  parentId: number;
  type: MDTNodeType;
  dataType?: string;
  equation: string;
  sequence: number;
  evalMethod?: string;
  disabled: boolean;
  required: boolean;
  damaged: boolean;
  canUserReview: boolean;
  canUserAmend: boolean;
  permissionType: string;
  fromRole: boolean;
  catalog: boolean;
  descriptions?: any;
  key: boolean;
  level: number;
  expanded: boolean;
  children?: any;
  nextElementId: number;
}

export interface MdtDataTypeWithUIProps {
  value?: string;
}

export interface MDTDependency {
  code: string;
  description: string;
  id: number;
  type: MDTNodeType;
  usedBy: string;
}

export interface MDTComparisonData extends Comparison {
  condition: string;
  template: string;
}

export interface MDTDeleteModal {
  isOpen: boolean;
  data: MdtNode | null;
  loading: boolean;
}

export enum MDTNodeType {
  NODE = "NODE",
  INPUT = "INPUT",
  VARIABLE = "VARIABLE",
  LIST = "LIST",
  DATA = "DATA",
}

export enum MDTNodeDataType {
  UNKNOWN = "UNKNOWN",
  NUMERIC = "NUMERIC",
  TEXT = "TEXT",
  DATE = "DATE",
  DATE_TIME = "DATE_TIME",
}

export enum MdtTesterCheckType {
  CONTAINS_SPACE = "CONTAINS_SPACE",
  INPUT_HAS_EQUATION = "INPUT_HAS_EQUATION",
  WRONG_NUMBER_OF_BRACKETS = "WRONG_NUMBER_OF_BRACKETS",
  VARIABLE_EQUATION_IS_NULL = "VARIABLE_EQUATION_IS_NULL",
  VARIABLE_EQUATION_CONTAINS_NON_EXISTING_NODES = "VARIABLE_EQUATION_CONTAINS_SPACE",
  VARIABLE_EQUATION_HAS_INCONSISTENT_DEPENDENCIES = "VARIABLE_EQUATION_HAS_INCONSISTENT_DEPENDENCIES",
  DUPLICATED_DEPENDENCIES = "DUPLICATED_DEPENDENCIES",
  NON_EXISTING_NODE = "NON_EXISTING_NODE",
  INVALID_MDT_DEPENDENT_NODES = "INVALID_MDT_DEPENDENT_NODES",
}
