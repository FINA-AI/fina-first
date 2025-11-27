import { FiDataType } from "./fi.type";
import { Report } from "./report.type";

export interface UserType {
  authType: string;
  blocked: boolean;
  changePassword: boolean;
  contactPerson?: string;
  contactPersonPosition?: null | string;
  contactPersonPositionStrId: number;
  contactPersonStrId: number;
  deleted: boolean;
  description: string;
  descriptionStrId: number;
  disabled: boolean;
  email: string;
  id: number;
  login: string;
  mustReLogin: boolean;
  password?: string;
  passwordChanged: boolean;
  phone: string;
  titleDescription: string;
  titleDescriptionStrId: number;
  userType: UserTypeEnum;
  groupIds?: null | number[];
  fiIds?: null | number[];
  permissionIds?: null | number[];
  returnIds?: null | number[];
  reportIds?: null | number[];
  mdtNodes?: null | any[];
  returnVersions?: null | any[];
  ecmGroups?: null | any[];
  uploadFileGroupIds?: null | number[];
  returnDefintionIds: number[];
}

export interface UserTypeWithUIProps extends UserType {
  uniqueId?: number | string;
}

interface UserAndGroupType {
  id: number;
  code: string;
  description: string;
  group: boolean;
  users: UserType[];
}

export interface UserAndGroupTypeWithUIProps extends UserAndGroupType {
  users: UserTypeWithUIProps[];
}

export interface UserAndGroup extends UserType, UserAndGroupType {}

export interface UserAndGroupWithUIProps
  extends UserTypeWithUIProps,
    UserAndGroupTypeWithUIProps {}

export const enum UserTypeEnum {
  FINA_USER = "FINA_USER",
  LDAP_USER = "LDAP_USER",
}

export interface UserState {
  editMode: boolean;
  filterValue: any;
  pagingLimit: number;
  pagingPage: number;
  user: UserType;
  userFullName: string;
  userLogin: string;
}

export interface NewUserInfo {
  userLogin: string;
  userFullName: string;
}

export interface UserFiData {
  fis: UserFi[];
  parent: UserFiType;
}

export interface UserFiType {
  address: string;
  code: string;
  createdAt: number;
  hasFiModel: boolean;
  id: number;
  level: number;
  name: string;
  roleFi: boolean;
}

export interface UserFi {
  address: string;
  code: string;
  createdAt: number;
  fiType: FiDataType;
  id: number;
  licenseCode: string;
  modifiedAt: number;
  name: string;
  roleFi: boolean;
  userFi: boolean;
}

export interface Permission {
  id: number;
  idName: string;
  name: string;
  nameStrId: number;
  permitted: boolean;
  userRolePermission: boolean;
}

export interface UserPermission extends Permission {}

export interface UserReportWithUIProps extends Report {
  level: number;
  leaf: boolean;
}
