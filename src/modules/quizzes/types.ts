export enum QuizOptionType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

/** Savol kontenti (UI / Swagger `mediaType` bilan mos) */
export enum QuizContentType {
  TEXT = 'TEXT',
  PHOTO = 'IMAGE',
  AUDIO = 'AUDIO',
}

/** Eski UI konstantalari (boshqa sahifalar uchun) */
export enum QuizType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SEQUENCE = 'sequence',
  MATCH_PAIRS = 'match_pairs',
  SINGLE_SELECT = 'single_select',
  MULTI_SELECT = 'multi_select',
  IMG = 'file',
}

/** Swagger: CreateQuizDto / QuizResponseDto.type */
export type ApiQuizChoiceKind = 'SINGLE_CHOICE' | 'MULTI_CHOICE';

/** Swagger: CreateQuizDto / QuizResponseDto.mediaType */
export type ApiQuizMediaKind = 'TEXT' | 'IMAGE' | 'AUDIO';

export interface Question {
  id: string;
  type: QuizContentType;
  content: string;
}

export interface Option {
  id?: string;
  type: QuizOptionType;
  value?: string;
  link?: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  /** @deprecated lessonId bilan bir xil (eski kod uchun) */
  courseId: string;
  question: string;
  type: QuizOptionType;
  kind?: ApiQuizChoiceKind;
  mediaType?: ApiQuizMediaKind;
  options: Option[];
}

/** Formadan keladigan yuborish shakli */
export interface QuizFormPayload {
  lessonId: string;
  question: string;
  type?: QuizOptionType;
  options: Array<{
    id?: string;
    value?: string;
    link?: string | File;
    type?: QuizOptionType;
    isCorrect: boolean;
  }>;
}

export interface QuizInput extends QuizFormPayload {}

export interface QuizEditBody {
  id: string;
  values: QuizFormPayload;
}
