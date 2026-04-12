import http from 'services/api';
import { VacancyEditBody, VacancyInput, VacancyListQuery } from './types';

export const GetVacanciesList = async (params?: VacancyListQuery) => {
  return await http.get(`/vacancy`, { params });
};

export const GetVacancyById = async (id: string) => {
  return await http.get(`/vacancy/${id}`);
};

export const CreateVacancy = async (values: VacancyInput) => {
  return await http.post(`/vacancy`, values);
};

export const EditVacancy = async ({ values, id }: VacancyEditBody) => {
  return await http.patch(`/vacancy/${id}`, values);
};

export const DeleteVacancy = async (id: string) => {
  return await http.delete(`/vacancy/${id}`);
};
