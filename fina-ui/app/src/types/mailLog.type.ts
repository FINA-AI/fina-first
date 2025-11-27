export interface MailLogDataType {
  address: string;
  fromAddress: string;
  id: number;
  mailId: string;
  mailType: string;
  mailUser: string;
  note?: string;
  readDate?: number;
  receiveDate: number;
  replyStatus: string;
  status?: string;
  toAddress: string;
}

export interface MailDataType {
  bcc: string;
  cc: string;
  content: string;
  date: number;
  from: string;
  id: number;
  sender: string;
  subject: string;
  to: string;
}
export interface attachmentType {
  id: number;
  fileName: string;
  type: any;
  uploadedTime: Date;
  uploadedTimeString: string;
  status: string;
  reason: string;
  protectionInfo: string;
  bankCode: string;
  bankCodes: string[];
  bankName: string;
  userId: number;
  userLogin: string;
  hasUserBank: boolean;
  nameValid: boolean;
  versionValid: boolean;
  matrixValid: boolean;
  convert: boolean;
  languageCode: string;
  scheduleIds: number[];
  fromDate?: Date;
  toDate?: Date;
  fileGroupId: number;
}

export enum MailLogStatus {
  SENT = "SENT",
  NOT_SENT = "NOT_SENT",
  IGNORE = "IGNORE",
  DISABLE = "DISABLE",
  LATER = "LATER",
  ACTIVE = "ACTIVE",
  ARCHIVE = "ARCHIVE",
  ERROR = "ERROR",
  IGNORE_REPLAY = "IGNORE_REPLAY",
}
