export interface UploadFile {
  bankCode: string;
  bankCodes: string | null;
  bankName: string;
  convert: boolean;
  fileName: string;
  fromDate: string | null;
  hasUserBank: boolean;
  id: number;
  languageCode: string | null;
  matrixId: number | null;
  matrixValid: boolean | null;
  nameValid: boolean;
  processEngine: string;
  protectioninfo: string;
  reason: string;
  scheduleIds: number[];
  status: string;
  toDate: string | null;
  type: string;
  uploadedTime: number;
  uploadedTimeString: string;
  userId: number;
  userLogin: string;
  versionValid: boolean | null;
  fileId: number;
  fileNameSafe: string;
}

export interface ReturnVersion {
  canUserAmend: boolean;
  canUserReview: boolean;
  code: string;
  hasAmendFromRole: boolean;
  id: number;
  name: string;
  nameStrId: number;
  sequence: number;
  userReturnVersion: boolean;
  userRoleReturnVersion: boolean;
  version: number;
}

export interface ImportManagerFilter {
  periodStart: number;
  periodEnd: number;
  fiCodes: string;
  versionCode: string;
  userCode: string;
  user: { login: string; description: string };
}

export interface ImportedReturn {
  bankCode: string;
  bankCodeSafe: string;
  fileId: number;
  fileName: string;
  fileNameSafe: string;
  group: boolean;
  id: number;
  importStart: number;
  importEnd: number;
  importType: string;
  langId: number;
  latest: boolean;
  message: string;
  messageSafe: string;
  periodStart: number;
  periodEnd: number;
  returnCode: string;
  returnCodeSafe: string;
  returnType: string | null;
  returnTypeSafe: string;
  status: string;
  uploadTime: number;
  userCode: string;
  userCodeSafe: string;
  userId: number;
  versionCode: string;
  versionCodeSafe: string;
}

export interface ChartData {
  name: string;
  value: number;
  key: "ERRORS" | "IMPORTED" | string;
}
