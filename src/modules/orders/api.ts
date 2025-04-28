import http from 'services/api';
import { IOrderInput } from './types';

export const GetDatasList = async (currentPage: number) => {
  return await http.get(`/order?pageSize=10&pageNumber=${currentPage}`);
};

export const EditData = async ({ status, id }: IOrderInput) => {
  return await http.patch(`/order/${id}`, { status });
};
