export interface EmsFileConfigurationDetailDataType {
  id?: number;
  cellObjectName?: string;
  cellObjectField?: string;
  cellObjectFieldType?: number | string;
  cellObjectFieldTypeName?: string;
  cellObjectFieldFormat?: string;
  mandatory?: boolean;
  sanctionFineTypeName?: { [key: string]: string };
  cellColumn?: string | number;
  sanctionFinePrice?: number;
  fileConfigurationId?: number;
  cellObject?: string | number;
  sanctionFineTypeId?: number;
  sanctionFineType?: FineType;
}

export interface FineType {
  article: string;
  fiType: string;
  id: number;
  names: { [key: string]: string };
  paragraph: string;
  price: number[] | null;
  rule: string;
}
