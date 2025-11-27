import { FiTypeDataType } from "./fi.type";

export interface LegislativeDocumentType extends FiTypeDataType {
  children: CategoryType[];
  level: number;
}

export interface CategoryType {
  children?: CategoryAttachmentType[];
  code?: string;
  documentCount?: null | number;
  documents?: any;
  id: string | number;
  leaf?: boolean;
  level?: number;
  nameStrId?: string;
  parentRowId?: string;
  version: number;
  name?: string;
}

export interface CategoryAttachmentType {
  bytes: number;
  content: any;
  description: string;
  fileName: string;
  id: number;
  notify: boolean;
  publish: number;
  publisher: string;
  sign: boolean;
  parentRowId: string;
  level: number | undefined;
  leaf: boolean;
  code: string;
}

export interface UploadDataType {
  description: string;
  file: File[];
  id: number;
  notify: boolean;
  sign: boolean;
}
