import http from 'services/api';
import {PremiumInputType,PremiumEditBodyType } from './types';

export const GetDatasList = async (currentPage: number) => {
  return await http.get(`/premium?page=${currentPage}&limit=10`);
};

export const GetUserList = async (currentPage?: number, search?: string) => {
  return await http.get(`/profile/users?page=${currentPage || 1}&limit=20&search=${search || ''}`).then((res)=>res.data);
};

export const CreateData = async (values:PremiumInputType) => {
  return await http.post(`/premium/gift`, values);
};

export const EditData = async ({
  values,
  id,
}:PremiumEditBodyType) => {
  return await http.patch(`/premium/${id}`, values);
};

export const DeleteData = async (id: string) => {
  return await http.delete(`/premium/${id}`);
};
