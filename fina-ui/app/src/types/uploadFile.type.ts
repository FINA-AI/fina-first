export interface UploadFileType {
  bankCode?: string;
  fileName: string;
  id: number;
  status: string;
  uploadedTime: number;
  userLogin: string;
  processEngine: string;
  matrixValid?: boolean;
  reason?: string;
  hasUserBank?: boolean;
  nameValid?: boolean;
  protectioninfo?: string;
}

export interface UploadFileStatusType {
  code: string;
  id: number;
  importEnd: number | Date;
  message: string;
  status: string;
  version: number;
  type: string;
}

export interface UploadFileFilterType {
  users?: number[];
  fileName?: string;
  status?: string;
  fis?: string[];
  page?: number;
  limit?: number;
  periodStart?: Date | null;
  periodEnd?: Date | null;
}
