import http from 'services/api';
import { ProductInputType, ProductEditBodyType } from './types';

export const GetDatasList = async (categoryId: string) => {
  return await http.get(`/product`, {params:{categoryId}});
};

export const CreateData = async (values: ProductInputType) => {
  return await http.post(`/product`, values);
};

export const EditData = async ({values,id}: ProductEditBodyType) => {
  return await http.patch(`/product/${id}`, values);
};

export const DeleteData = async (id: string) => {
  return await http.delete(`/product/${id}`);
};
