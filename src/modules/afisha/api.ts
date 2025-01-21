import http from 'services/api';
import { Afisha, AfishaEditBody, AfishaInput } from './types';

export const GetAfishaList = async (currentPage: number) => {
  return await http.get(`/afisha?page=${currentPage}`);
};

export const CreateAfisha = async (values: AfishaInput) => {
  return await http.post<{ data: Afisha }>(`/afisha/`, values);
};

export const EditAfisha = async ({ values, id }: AfishaEditBody) => {
  return await http.patch(`/afisha/${id}`, values);
};

export const DeleteAfisha = async (id: string) => {
  return await http.delete(`/afisha/${id}`);
};
