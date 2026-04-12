import http from 'services/api';
import { toCreateQuizDto, toUpdateQuizDto } from '../quizzes/api';
import { QuizEditBody, QuizInput } from './types';
import { QuizOptionType } from '../quizzes/types';

/** Eski `QuizInput.courseId` = dars `lessonId` */
const legacyToPayload = (input: QuizInput) => ({
  lessonId: input.courseId,
  question: input.question,
  type: QuizOptionType.TEXT,
  options: (input.options ?? []).map((o) => ({
    id: (o as { id?: string }).id,
    value: o.value ?? '',
    link: '',
    type: QuizOptionType.TEXT,
    isCorrect: !!o.isCorrect,
  })),
});

export const GetQuizzesList = async (lessonId: string, pageNumber: number) => {
  return await http.get(`/quiz`, { params: { lessonId, pageNumber, pageSize: 25 } });
};

export const CreateQuiz = async (values: QuizInput) => {
  return await http.post(`/quiz`, toCreateQuizDto(legacyToPayload(values)));
};

export const EditQuiz = async ({ values, id }: QuizEditBody) => {
  return await http.patch(`/quiz/${id}`, toUpdateQuizDto(legacyToPayload(values)));
};

export const DeleteQuiz = async (id: string) => {
  return await http.delete(`/quiz/${id}`);
};
