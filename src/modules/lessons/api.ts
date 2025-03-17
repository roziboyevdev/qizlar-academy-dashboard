import http from "services/api";
import { LessonCreateInput, LessonEditBody } from "./types";

export const GetLessonsList = async (moduleId: string, currentPage: number) => {
  return await http.get(`/lesson`, { params: { moduleId: moduleId,pageNumber:currentPage } });
};

export const CreateLesson = async (values: LessonCreateInput) => {
  return await http.post(`/lesson/`, values);
};

export const EditLesson = async ({ values, id }: LessonEditBody) => {
  return await http.patch(`/lesson/${id}`, values);
};

export const DeleteLesson = async (id: string) => {
  return await http.delete(`/lesson/${id}`);
};
