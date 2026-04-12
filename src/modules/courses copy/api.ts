import http from 'services/api';
import type { CourseEditBody, CourseInput } from './types';

const toCourseApiBody = (values: CourseInput) => ({
  name: values.title,
  description: values.description ?? '',
  shortDescription: values.seoDescription ?? values.description ?? '',
  bannerImage: values.banner ?? '',
  icon: values.icon ?? '',
  teacherId: values.teacherId ?? '',
  isActive: values.isActive ?? true,
});

export const GetCoursesList = async (pageNumber?: number) => {
  return await http.get(`/course`, { params: { pageSize: 100, pageNumber } });
};

export const CreateCourse = async (values: CourseInput) => {
  return await http.post(`/course`, toCourseApiBody(values));
};

export const EditCourse = async ({ values, id }: CourseEditBody) => {
  return await http.patch(`/course/${id}`, toCourseApiBody(values));
};

export const DeleteCourse = async (id: string) => {
  return await http.delete(`/course/${id}`);
};
