import http from 'services/api';
import { IOrderInput } from './types';

export const GetDatasList = async (currentPage: number, filters: { status?: string }) => {
  const params: Record<string, string | number> = {
    pageSize: 10,
    pageNumber: currentPage,
  };
  if (filters.status && filters.status !== 'ALL_STATUS') {
    params.status = filters.status;
  }
  return await http.get(`/order/admin`, { params });
};

export const GetOrderAdminOne = async (id: string) => {
  return await http.get(`/order/admin/${id}`);
};

export const GetOrderOne = async (id: string) => {
  return await http.get(`/order/${id}`);
};

export const EditData = async ({ status, id }: IOrderInput) => {
  return await http.patch(`/order/admin/${id}/status`, { status });
};

export const SearchUserId = async (search: string) => {
  return await http.get(`/users?search=${search}`);
};

export const SearchCourseId = async (search: string) => {
  return await http.get(`/course`, { params: { search, pageNumber: 1, pageSize: 50 } });
};

export const CreateEnrollmet = async (courseId: string, userId: string) => {
  return await http.post(`/enrollment`, { courseId, userId });
};
