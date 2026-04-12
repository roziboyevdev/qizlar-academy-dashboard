import http from 'services/api';
import { LessonEditBody, LessonInput } from './types';

const stripHtml = (html: string) =>
  (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const GetLessonsList = async (moduleId: string, currentPage: number, courseId?: string) => {
  return await http.get(`/lesson`, {
    params: {
      moduleId,
      pageNumber: currentPage,
      pageSize: 20,
      ...(courseId ? { courseId } : {}),
    },
  });
};

export const GetCourseLessonsList = async (courseId: string) => {
  return await http.get(`/lesson`, { params: { courseId, pageNumber: 1, pageSize: 500 } });
};

export const CreateLesson = async (values: LessonInput) => {
  return await http.post(`/lesson`, values);
};

export const EditLesson = async ({ values, id }: LessonEditBody) => {
  return await http.patch(`/lesson/${id}`, values);
};

export const DeleteLesson = async (id: string) => {
  return await http.delete(`/lesson/${id}`);
};
