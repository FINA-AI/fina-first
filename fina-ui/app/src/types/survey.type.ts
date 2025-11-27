export interface Survey {
  id: number;
  name: string;
  progression: string;
  survey: string;
  userName: string;
}

export interface SurveySideMenu {
  open: boolean;
  row: Survey | null;
}

export interface SurveyUploadModal {
  title: string;
  open: boolean;
}

export interface SurveyResult {
  key: string;
  value: string;
}
