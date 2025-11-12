import { SurveyContext } from './constants';

export interface ISurvey {
  id: string;
  question: string;
  context: SurveyContext;
  points?: number;
  options?: string[];
  courseId?: string;
  lessonId?: string;
  createdAt: string;
}

export interface ISurveyInput {
  question: string;
  context: SurveyContext;
  points?: number;
  options?: string[];
  courseId?: string;
  lessonId?: string;
}

export interface ISurveyEditBody {
  id: string;
  values: ISurveyInput;
}
