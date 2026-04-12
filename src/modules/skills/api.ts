import http from 'services/api';
import { SkillInput } from './types';

export const GetSkillsList = async (pageNumber: number, pageSize: number) => {
  return await http.get('/skill', { params: { pageNumber, pageSize } });
};

export const CreateSkill = async (values: SkillInput) => {
  return await http.post('/skill', values);
};

export const DeleteSkill = async (id: string) => {
  return await http.delete(`/skill/${id}`);
};
