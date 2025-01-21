import http from 'services/api';
import { Grandmaster, GrandmasterEditBody, GrandmasterInput } from './types';

export const GetGrandmastersList = async (currentPage: number) => {
  return await http.get(`/grandmasters?page=${currentPage}`);
};

export const CreateGrandmaster = async (values: GrandmasterInput) => {
  return await http.post<{ data: Grandmaster }>(`/grandmasters/`, values);
};

export const EditGrandmaster = async ({ values, id }: GrandmasterEditBody) => {
  return await http.patch(`/grandmasters/${id}`, values);
};

export const DeleteGrandmaster = async (id: string) => {
  return await http.delete(`/grandmasters/${id}`);
};
