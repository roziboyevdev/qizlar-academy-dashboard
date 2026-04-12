import { useQuery } from '@tanstack/react-query';
import { GetSkillsList } from '../api';
import { Skill } from '../types';

export const useSkillsList = (pageNumber: number = 1, pageSize: number = 20) => {
  return useQuery({
    queryKey: ['skills_list', pageNumber, pageSize],
    queryFn: async () => {
      const response = await GetSkillsList(pageNumber, pageSize);
      return {
        data: response.data?.data?.data as Skill[],
        paginationInfo: response.data?.data?.meta?.pagination,
      };
    },
  });
};
