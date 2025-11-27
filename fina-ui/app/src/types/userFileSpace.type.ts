export interface SideMenuType {
  open?: boolean;
  row: any;
}

export interface UserFile {
  descriptions: {
    lc: string;
    dc: string;
  }[];
  file: boolean;
  folder: boolean;
  id: string;
  lastModified: number;
  name: string;
  parentId: string;
  path: string;
  versionId?: number;
}
