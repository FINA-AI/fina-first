import { FilterType } from "./common.type";

export interface DashletType {
  id: number;
  dataColumns: string[];
  dataQuery: string;
  metaInfoJson: string;
  name: string;
  code: string;
  filters: FilterType[];
}

export interface DashletDataType {
  createdAt: number;
  type: string;
  [key: string]: number | string;
}

export interface DashletStyleType {
  fill: string;
  stroke: string;
}

export interface DashboardType {
  columnSize: number;
  configJson: string;
  dashboardLayout: number;
  dashboardName: string;
  dashletList: DashletType[];
  dashlets: { [key: string]: { id: number; list: DashletType[] } };
  id: number;
  isDefault: boolean;
  layout: {
    id: number;
    len: number;
    name: string;
  };
  name: string;
  code: string;
}

export interface DashboardColumnType {
  [key: string]: {
    id: string | number;
    list: DashletType[];
  };
}

export interface UpdateDashboardType {
  id?: number;
  dashlets: DashboardColumnType;
  dashboardName: string;
  layout: {
    id: number;
    len: number;
    name: string;
  };
  code: string;
}
