export interface ICourseReward {
  id: string;
  courseId: string;
  lessonId: string;
  rewardId?: string;
  file: string | File;
}

export interface ICourseRewardInput {
  courseId: string;
  lessonId: string;
  rewardId?: string;
  file: string | File;
}

export interface ICourseAssistantEdit {
  id: string;
  values: ICourseRewardInput;
}
