export enum LessonRewardType {
  COIN = 'COIN',
  PRODUCT = 'PRODUCT',
  PROMOCODE = 'PROMOCODE',
  EMPTY = 'EMPTY',
}

export interface LessonReward {
  id: string;
  title: string;
  photo: string;
  description: string;
  value: number;
  count: number;
  type: LessonRewardType;
}

export interface LessonRewardInputType {
  value: number;
  title: string;
  photo: string;
  description: string;
  count: number;
  type: LessonRewardType;
}

export interface LessonRewardEditBodyType {
  id: string;
  values: LessonRewardInputType;
}
