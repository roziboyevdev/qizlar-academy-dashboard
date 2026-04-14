import http from 'services/api';
import type { CourseEditBody, CourseInput } from './types';

type CourseListParams = {
  pageNumber?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
  teacherId?: string;
};

const compactParams = (params: CourseListParams) => {
  const out: Record<string, unknown> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined) return;
    if (typeof v === 'string' && v.trim() === '') return;
    out[k] = v;
  });
  return out;
};

const toCourseApiBody = (values: CourseInput) => ({
  name: values.name ?? values.title ?? '',
  description: values.description ?? '',
  shortDescription: values.shortDescription ?? values.seoDescription ?? values.description ?? '',
  bannerImage: values.bannerImage ?? values.banner ?? '',
  icon: values.icon ?? '',
  teacherId: values.teacherId ?? '',
  isActive: values.isActive ?? false,
});

export const GetCoursesList = async (params: CourseListParams = {}) => {
  return await http.get(`/course`, { params: compactParams(params) });
};

export const CreateCourse = async (values: CourseInput) => {
  return await http.post('/course', toCourseApiBody(values));
};

export const EditCourse = async ({ values, id }: CourseEditBody) => {
  return await http.patch(`/course/${id}`, toCourseApiBody(values));
};

export const DeleteCourse = async (id: string) => {
  return await http.delete(`/course/${id}`);
};

