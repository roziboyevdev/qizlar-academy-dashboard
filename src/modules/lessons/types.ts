export interface Lesson {
  id: string;
  title: string;
  description: string;
  link: string;
  moduleId: string;
  duration: number;
  isSoon: boolean;
  isActive: boolean;
  orderId: number;
}

export interface LessonCreateInput {
  title: string;
  description: string;
  link: string;
  moduleId: string;
  duration?: number;
  isSoon: boolean;
  isActive: boolean;
}

export interface LessonEditInput {
  title: string;
  description: string;
  link: string;
  moduleId: string;
  duration?: number;
  isSoon: boolean;
  isActive: boolean;
}

export interface LessonEditBody {
  id: string;
  values: LessonEditInput;
}
