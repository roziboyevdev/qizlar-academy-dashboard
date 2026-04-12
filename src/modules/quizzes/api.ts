import http from 'services/api';
import type { QuizEditBody, QuizFormPayload } from './types';
import { QuizOptionType } from './types';

const normOptionType = (t?: string): QuizOptionType => {
  if (t === 'IMAGE' || t === QuizOptionType.IMAGE) return QuizOptionType.IMAGE;
  if (t === 'AUDIO' || t === QuizOptionType.AUDIO) return QuizOptionType.AUDIO;
  return QuizOptionType.TEXT;
};

/** Swagger CreateQuizOptionDto */
const toCreateOptions = (options: QuizFormPayload['options']) =>
  (options ?? []).map((o) => ({
    value: o.value ?? '',
    link: typeof o.link === 'string' ? o.link : '',
    type: normOptionType(o.type),
    isCorrect: !!o.isCorrect,
  }));

/** Swagger UpdateQuizOptionDto */
const toUpdateOptions = (options: QuizFormPayload['options']) =>
  (options ?? []).map((o) => ({
    ...(o.id ? { id: o.id } : {}),
    value: o.value ?? '',
    link: typeof o.link === 'string' ? o.link : '',
    type: normOptionType(o.type),
    isCorrect: !!o.isCorrect,
  }));

const deriveChoiceKind = (options: QuizFormPayload['options']): 'SINGLE_CHOICE' | 'MULTI_CHOICE' => {
  const n = (options ?? []).filter((o) => o.isCorrect).length;
  return n > 1 ? 'MULTI_CHOICE' : 'SINGLE_CHOICE';
};

const deriveMediaType = (values: QuizFormPayload): 'TEXT' | 'IMAGE' | 'AUDIO' => {
  const t = values.type;
  if (t === QuizOptionType.IMAGE) return 'IMAGE';
  if (t === QuizOptionType.AUDIO) return 'AUDIO';
  return 'TEXT';
};

export const toCreateQuizDto = (values: QuizFormPayload) => ({
  type: deriveChoiceKind(values.options),
  mediaType: deriveMediaType(values),
  question: values.question,
  lessonId: values.lessonId,
  options: toCreateOptions(values.options),
});

export const toUpdateQuizDto = (values: QuizFormPayload) => ({
  type: deriveChoiceKind(values.options),
  mediaType: deriveMediaType(values),
  question: values.question,
  options: toUpdateOptions(values.options),
});

export const GetQuizzesList = async (lessonId: string) => {
  return await http.get(`/quiz/lesson/${lessonId}`);
};

export const GetQuizById = async (quizId: string) => {
  return await http.get(`/quiz/${quizId}`);
};

export const CreateQuiz = async (values: QuizFormPayload) => {
  return await http.post(`/quiz`, toCreateQuizDto(values));
};

export const EditQuiz = async ({ values, id }: QuizEditBody) => {
  return await http.patch(`/quiz/${id}`, toUpdateQuizDto(values));
};

export const DeleteQuiz = async (id: string) => {
  return await http.delete(`/quiz/${id}`);
};
