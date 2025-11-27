import { TreeGridColumnType } from "./common.type";

export interface Catalog {
  id: number;
  code: string;
  name: string;
  nameStrId: number;
  abbreviation: string;
  ancestorCatalogInfo: string;
  attachment: File;
  attachmentName: string;
  catalogColumns: CatalogColumn[];
  createdAt: number;
  modifiedAt: number;
  legislativeDocumentId: number;
  legislativeDocumentName: string;
  mdtCode: string;
  referenceNumber: string;
  source: string;
  validTo: Date | null;
}

export interface CatalogColumn {
  id: number;
  dataType: string;
  name: string;
  names: Record<string, string>;
  nameStrId: number;
  key: boolean;
  isRequired: boolean;
  sequence: number;
  dataFormat: string;
  formattedValue: string;
}

export interface CatalogItem {
  createdAt: number;
  deleted: boolean;
  leaf: boolean;
  modifiedAt: number;
  nodeId: number;
  parentRowId: number;
  rowId: number;
  rowItems: CatalogRowItem[];
  rowNumber: number;
  version: string;
}

export interface CatalogItemWithUIProps extends Omit<CatalogItem, "rowItems"> {
  level: number;
  children: CatalogItemWithUIProps[];
  rowItems: Partial<CatalogRowItem>[];
}

export interface CatalogRowItem {
  id: number;
  rowNumber: number;
  deleted: boolean;
  nameStrId: number;
  nodeId: number;
  value: string;
  valuesI18n: Record<string, string>;
  versionCode: string;
  versionId: number;
  column: {
    dataFormat: string;
    dataType: string;
    id: number;
    isRequired: boolean;
    key: boolean;
    name: string;
    nameStrId: number;
    names: Record<string, string>;
    sequence: number;
  };
}

export interface CatalogItemHistory {
  modifiedAt: number;
  test: string;
  version: number;
}

export interface CatalogAddItemModal {
  isOpen: boolean;
  data: CatalogItemWithUIProps | null;
  isEdit?: boolean;
}

export interface DependenciesDeleteModal {
  isOpen: boolean;
  row: CatalogItemWithUIProps | null;
}

export interface CatalogItemTreeState {
  data: CatalogItemWithUIProps[];
  columns: TreeGridColumnType[];
}

export interface CatalogCreateGeneral {
  number: string;
  code: string;
  name: string;
  source: string;
  abbreviation: string;
}

export interface CatalogCreateMeta {
  fileName?: string;
  file: {
    file: File | null;
  } | null;
  formData: FormData | null;
  legislativeDocument: CatalogCreateLegislativeDoc;
  replacesCatalog: string;
  validTill: Date | null;
  format?: string;
}

export interface CatalogCreateLegislativeDoc {
  fileName: string;
  id: number | null;
}

export interface CatalogCreateStructureRow {
  itemIdx: number;
  name?: string;
  format: string;
  id: number;
  type: string;
  key: boolean;
  required: boolean;
  nameStrId: number;
  sequence: number;
}

export interface CatalogForm {
  fields: {
    type?: string;
    dataType?: string;
    dataFormat?: string;
    formattedValue?: string;
    isRequired?: boolean;
    name?: string;
    key?: boolean;
  }[];
}
