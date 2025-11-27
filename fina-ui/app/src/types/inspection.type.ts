export interface InspectionType {
  id: number;
  names: Record<string, string>;
  descriptions: Record<string, string>;
}

export interface EmsInspectionType {
  id: number;
  names: string;
  descriptions: string;
  syncronized?: boolean;
}

export interface InspectionColumnData {
  id?: number;
  type?: string | string[] | undefined;
  names: {
    [key: string]: string;
  };
  visible: boolean;
  listValues?: string[];
  columnId?: number;
}

export interface EmsFileConfigDataTypes {
  id?: number;
  fiType: string;
  creationDate?: string;
  active: boolean;
  sheetStartRow?: number;
  exportFileTemplateName: string;
  exportFileTemplateContent: string;
}

export interface EmsInspectionStatusHistoryType {
  id: number;
  inspectionId: number;
  note: string;
  time: number;
  type: string;
  userId: string;
}
