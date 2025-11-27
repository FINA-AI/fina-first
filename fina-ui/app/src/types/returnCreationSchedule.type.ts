export interface ReturnSchedule {
  definitionIds: number[];
  delay: number;
  fiIDs: number[];
  id: number;
  message: string | null;
  onDemand: boolean;
  parentId: number;
  periodFrom: string | null;
  periodTo: string | null;
  periodTypeId: number;
  returnTypeId: number;
  scheduleId: number;
  scheduleIds: any[];
  scheduleTime: number | Date | null;
  status: string;
  taskName: string;
  userName: string;
  versionCode: string | null;
  versionId: number;
}
