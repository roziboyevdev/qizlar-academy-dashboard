import http from 'services/api';
import { QuizEditBody, QuizInput } from './types';

export const GetQuizzesList = async (lessonId: string, currentPage: number) => {
  return await http.get(`/exam/admin?course=${lessonId}&limit=20&page=${currentPage}`);
};


export const CreateQuiz = async (values: QuizInput) => {
  return await http.post(`/exam/`, values);
};

export const EditQuiz = async ({ values, id }: QuizEditBody) => {
  return await http.patch(`/exam/${id}`, values);
};

export const DeleteQuiz = async (id: string) => {
  return await http.delete(`/exam/${id}`);
};
