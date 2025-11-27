export interface CalendarDataType {
  calendarPeriodType?: string;
  comment?: string;
  date?: number;
  eventType?: string;
  id?: string;
  calendarWeekDay?: string;
  from?: number;
  to?: number;
  day?: number | string;
  month?: string;
}

export interface CalendarPeriodType {
  from: Date;
  to: Date;
}
