export enum QuizContentType {
  TEXT = 'text',
  PHOTO = 'photo',
  AUDIO = 'audio',
}

export enum QuizType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SEQUENCE = 'sequence',
  MATCH_PAIRS = 'match_pairs',
  SINGLE_SELECT = 'single_select',
  MULTI_SELECT = 'multi_select',
  IMG = 'file',
}


export interface Question {
  id: string;
  type: QuizContentType;
  content: string;
}

export interface OptionValue {
  id: string;
  type: QuizContentType;
  content: string;
}



export interface Question {
  id: string;
  value: string;
}



export interface Option {
  value: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  courseId: string;
  question:string;
  options: Option[];
}

export interface QuizInput {
  courseId: string;
  question: string;
  options: Option[];
}

export interface QuizEditBody {
  id: string;
  values: QuizInput;
}
