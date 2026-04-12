import http from 'services/api';
import { ModuleEditBody, ModuleCreateInput } from './types';

export const GetModulesList = async (courseId: string) => {
  return await http.get(`/course-module`, { params: { courseId, pageNumber: 1, pageSize: 200 } });
};

export const CreateModule = async (values: ModuleCreateInput) => {
  return await http.post(`/course-module`, {
    name: values.title,
    description: '',
    icon: '',
    courseId: values.courseId,
    isActive: values.isActive,
  });
};

export const EditModule = async ({ values, id }: ModuleEditBody) => {
  return await http.patch(`/course-module/${id}`, {
    name: values.title,
    description: '',
    icon: '',
    isActive: values.isActive,
  });
};

export const DeleteModule = async (id: string) => {
  return await http.delete(`/course-module/${id}`);
};
