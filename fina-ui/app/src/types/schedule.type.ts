import { FiType } from "./fi.type";
import { PeriodSubmitDataType } from "./period.type";
import { ReturnDefinitionType } from "./returnDefinition.type";

export interface ScheduleType {
  id: number;
  comment?: string;
  delay: number;
  delayHour: number;
  delayMinute: number;
  fi: FiType;
  period: PeriodSubmitDataType;
  returnDefinition: ReturnDefinitionType;
  definitionCode?: string;
  versionCode?: string;
  message?: string;
}
