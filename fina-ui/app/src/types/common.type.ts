import React from "react";
import { DefinitionTableDataType } from "./matrix.type";
import { MdtNode } from "./mdt.type";

export interface PagingType<T> {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalResults: number;
  readonly sortDirections?: any;
  readonly sortFields?: any;
  readonly start: number;
  list: ReadonlyArray<T>;
}

export interface ConfigType {
  advancedDashboardEnable?: boolean;
  authenticationType?: string;
  changePassword?: boolean;
  dateFormat?: string;
  dateTimeFormat?: string;
  ecmEnable?: boolean;
  enaleXlsxSupport?: boolean;
  exportImportEnable?: boolean;
  finaStatUrl?: string;
  isInternalUser?: boolean;
  language?: string;
  maxPostSize?: number;
  maxPostSizeDisplayValue?: string;
  menu?: any;
  menuItems?: any;
  newMessages?: number;
  numberFormat?: string;
  passwordPolicy?: {
    letters: boolean;
    minLength: number;
    numbers: boolean;
    specialCharacters: boolean;
    upperCase: boolean;
  };
  permissions?: string[];
  theme?: string;
  user?: string;
  userName?: string;
  properties?: any;
}

export interface GridColumnType {
  readonly field: string;
  readonly headerName?: string;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly editable?: boolean;
  readonly hideCopy?: boolean;
  renderCell?: (value: any, row: any, colIndex: number) => any;
  readonly format?: string;
  hidden?: boolean;
  fixed?: boolean;
  isSelected?: boolean;
  readonly id?: string;
  readonly index?: number;
  sequence?: number;
  readonly title?: string;
  readonly flex?: number;
  width?: number;
  readonly filter?: any;
  readonly hideSort?: boolean;
  hideBackground?: boolean;
  stepperIndex?: number;
}

export interface TreeGridColumnType {
  readonly dataIndex: string;
  readonly renderer?: any;
  fixed?: boolean;
  hidden?: boolean;
  filter?: any;
  minWidth?: number;
  title: string;
  headerName?: string;
  sortable?: boolean;
  readonly field?: string;
  readonly flex?: number;
  readonly width?: number;
  hideSort?: boolean;
  hideCopy?: boolean;
}

export interface TreeGridStateType {
  columns: TreeGridColumnType[];
  treeData: any;
}

export interface DeleteFormType {
  isOpen: boolean;
  selectedRow: any;
}

export interface columnFilterConfigType {
  readonly field?: string;
  readonly dataIndex?: string;
  readonly type?: string;
  readonly name?: string;
  readonly renderFilter?: (
    columnsFilter: any,
    onFilterClick: any,
    onClear: any
  ) => any;
  readonly value?: any;
  readonly filterArray?: {
    label: string;
    value: string | number;
  }[];
  readonly start?: number;
  readonly end?: number;
  readonly headerName?: string;
}

export interface LanguageType {
  id: number;
  code: string;
  name: string;
  numberFormat: string;
  dateFormat: string;
  dateTimeFormat: string;
  default: boolean;
  fontFace: string;
  fontSize: number;
  htmlCharSet: string;
  xmlEncoding: string;
}

export interface LanguageTypeWithUIProps extends LanguageType {
  value: number;
}

export const enum FieldSize {
  SMALL = "small",
  DEFAULT = "default",
}

export interface CountryDataTypes {
  code: string;
  id: number;
  level: number;
  name: string;
  parentId: number;
  code1?: string;
  version?: number;
  sequence?: number;
  nameStrId?: number;
  deleted?: boolean;
}

export interface FilterType {
  [key: string]: any;
}

export const enum UserAuthTypeEnum {
  LDAP = "LDAP",
  FINA = "FINA",
  MIXED = "MIXED",
}

export interface SortInfoType {
  sortField: string;
  sortDir: string;
}

export interface CitizenshipDataType {
  id: number;
  code: string;
  code1?: string;
  version?: number;
  sequence: number;
  nameStrId: number;
  name: string;
  parentId: number;
  level: number;
  deleted?: boolean;
}

export interface TreeState<T = any> {
  treeData: T;
  columns: TreeGridColumnType[];
}

export type UIEventType = React.MouseEvent<
  HTMLElement | SVGElement | HTMLButtonElement
>;

export type ContextMenuInfo = {
  x: number;
  y: number;
  row: DefinitionTableDataType | MdtNode;
  target: Element | HTMLElement;
} | null;

export enum DroppableTypes {
  SOURCE_LIST = "source-list",
  DESTINATION_LIST = "destination-list",
}

export enum ReviewEngine {
  POI = "POI",
  AOO = "AOO",
}
