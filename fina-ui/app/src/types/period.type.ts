export interface PeriodSubmitDataType {
  id: number;
  fromDate: number;
  periodNumber: number;
  toDate: number;
  periodType: PeriodType;
  daysInAPeriod?: number;
  daysBetweenPeriod?: number;
  startPeriodNumber?: number;
}

export interface PeriodType {
  id: number;
  code: string;
  name: string;
  nameStrId: number;
  periodType: string;
  version: number;
}

export interface PeriodDefinitionType {
  id: number;
  fromDate: number;
  toDate: number;
  periodNumber: number;
  periodType: PeriodType;
  code: string;
  name: string;
}
