import { FiTypeDataType } from "./fi.type";
import { ReturnDefinitionType } from "./returnDefinition.type";
import { LanguageTypeWithUIProps } from "./common.type";
import { MdtDataTypeWithUIProps } from "./mdt.type";

export interface ReleaseMDTFiType extends Omit<FiTypeDataType, "id"> {
  id: string;
  fixed: boolean;
  sequence: number;
  isSelected: boolean;
}

export interface OSTPackage {
  code: string;
  fiTypes: FiTypeDataType[];
  hasFiTypes: boolean;
  hasReturnDefinitions: boolean;
  id: number;
  note: string;
  returnDefinitions: ReturnDefinitionType[];
  type: string;
}

export interface MDTToXMLData {
  folder: string;
  language: LanguageTypeWithUIProps | null;
  definition: ReturnDefinitionType | null;
  mdt: Partial<MdtDataTypeWithUIProps>[];
  allReturns: boolean;
  value?: string;
}

export interface ReturnToXMLData {
  folderLocation?: string;
  languageCode?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface PackageReturnDefinitionType extends ReturnDefinitionType {
  sequence?: number;
  isSelected?: boolean;
  dndId?: string;
}
