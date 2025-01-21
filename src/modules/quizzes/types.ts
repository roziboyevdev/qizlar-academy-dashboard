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

export interface Option {
  id: string;
  value: OptionValue[];
  is_correct: boolean;
}

export interface Quiz {
  id: string;
  question: Question[];
  type: QuizType;
  options: Option[];
}

export interface QuizInput {
  lesson: string;
  question: Omit<Question, 'id'>[];
  type: QuizType;
  options: { value: Omit<OptionValue, 'id'>[]; is_correct: boolean }[];
}

export interface QuizEditBody {
  id: string;
  values: QuizInput;
}
