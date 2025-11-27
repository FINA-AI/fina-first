export interface Property {
  description: string;
  id: number;
  key: string;
  value: string;
  immutableData: Property;
}

export interface Language {
  code: string;
  dateFormat: string;
  dateTimeFormat: string;
  default: boolean;
  fontFace: string;
  fontSize: number;
  htmlCharSet: string;
  id: number;
  name: string;
  numberFormat: string;
  version: number;
  xmlEncoding: string;
  htmlEncoding: string;
  editMode: boolean;
  isDefault: boolean;
}
