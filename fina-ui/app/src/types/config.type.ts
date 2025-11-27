import { PermittedMenuItem } from "./mainMenu.type";

export interface Config {
  advancedDashboardEnable: boolean;
  authenticationType: string;
  changePassword: boolean;
  dateFormat: string;
  dateTimeFormat: string;
  ecmEnable: boolean;
  enaleXlsxSupport: boolean;
  exportImportEnable: boolean;
  finaStatUrl: string;
  i18nTranslationVersion: string;
  language: string;
  maxPostSize: number;
  maxPostSizeDisplayValue: string;
  menu: PermittedMenuItem[];
  numberFormat: string;
  passwordPolicy: {
    letters: boolean;
    minLength: number;
    numbers: boolean;
    specialCharacters: boolean;
    upperCase: boolean;
  };
  permissions: string[];
  properties: {
    CERTIFICATE_MODE: string;
    ECM_ENABLED: boolean;
    "fina2.auditlog.sort.disabled": boolean;
    matrixMappingSource: string;
    "net.fina.blocked.email.domains": string;
    "net.fina.ems.system.impl.name": string;
    "net.fina.user.requiredFields": string;
  };
  theme: any;
  user: string;
  userNameDescriptions: Record<string, string>;
  newMessages: number;
}
