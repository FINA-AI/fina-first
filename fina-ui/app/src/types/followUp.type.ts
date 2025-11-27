export interface FollowUpType {
  id: number;
  inspection?: FollowupInspectionType;
  status: string;
  deadLine: number;
  result: string;
  note: string;
  type: object;
}

export interface FollowupInspectionType {
  reclamationLetterDate: number;
  reclamationLetterNumber: string;
  decreeNumber: string;
  decreeDate: number;
  types: [];
}

export interface FollowUpRecommendationType {
  id: number;
  recommendation: string;
  deadLine?: number;
  result: string;
  status: string;
  note?: string;
}

export interface FollowUpFilterType {
  searchIn?: string;
  fiIds?: number[];
  deadlineDateFrom?: Date | number;
  deadlineDateTo?: Date | number;
  decreeNumber?: string;
  reclamationLetterNumber?: string;
  status?: string;
  result?: string;
}
