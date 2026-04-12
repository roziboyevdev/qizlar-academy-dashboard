export enum LessonLinkType {
  YOU_TUBE = 'YOU_TUBE',
  VIDEO = 'VIDEO',
}

export interface Lesson {
  id: string;
  name: string;
  title?: string;
  description: string;
  shortDescription?: string;
  link: string;
  photo?: string;
  thumbnail?: string;
  moduleId: string;
  duration: number;
  orderIndex: number;
  orderId?: number;
  isActive?: boolean;
  isSoon?: boolean;
  linkType?: LessonLinkType;
}

export interface LessonInput {
  name: string;
  description: string;
  shortDescription?: string;
  link: string;
  photo?: string;
  duration: number;
  courseId?: string;
  moduleId: string;
  orderIndex?: number;
}

export interface LessonEditBody {
  id: string;
  values: Partial<LessonInput>;
}
