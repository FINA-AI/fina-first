import { Permission, UserType } from "./user.type";

export interface Group {
  id: number;
  code: string;
  description: string;
  descriptionStrId: number;
  fiIds: number[];
  mdtNodes: number[];
  mustReLogin: boolean;
  permissionIds: number[];
  permittedMatrixIds: number[];
  reportIds: number[];
  returnDefintionIds: number[];
  returnVersions: number[];
  userCount: number;
  users: UserType[];
}

export interface GroupVersion {
  id: number;
  code: string;
  name: string;
  nameStrId: number;
  sequence: number;
  version: number;
  canUserAmend: boolean;
  canUserReview: boolean;
  hasAmendFromRole: boolean;
  userReturnVersion: boolean;
  userRoleReturnVersion: boolean;
}

export interface GroupPermission extends Permission {}
