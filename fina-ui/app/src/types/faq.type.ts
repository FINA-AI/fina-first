export interface FaqListDataType {
  id: number;
  leaf: boolean;
  name: string;
  parentId: number;
  level: number;
  nameStrId?: number;
  children: FaqListDataType[];
}

export interface FaqDataType {
  answer: string;
  category: FaqCategoryDataType;
  id: number;
  publish: number;
  question: string;
  questionStrId: string;
  sequence: number;
  user: string;
  index: number;
}

export interface FaqCategoryDataType {
  id: number;
  name?: string;
  parentId?: number;
  leaf?: boolean;
}
