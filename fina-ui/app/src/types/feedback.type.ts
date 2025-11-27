export interface FeedbackType {
  id: number;
  nameStrId: number;
  description: string;
  feedbackCategory: FeedbackCategoryType;
  rating: number;
}

export interface FeedbackCategoryType {
  id: number;
  nameStrId: number;
  name: string;
}
