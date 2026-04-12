import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { GetStatsByArea } from '../api';
import type { IAreaStat, AreaSortBy } from '../types';

interface ApiResponse {
  data: {
    data: IAreaStat[];
  };
}

export const useStatsByArea = (sortBy: AreaSortBy = 'profiles') => {
  const { data, ...args } = useQuery<ApiResponse, Error, IAreaStat[]>({
    queryKey: ['stats-by-area', sortBy],
    queryFn: () => GetStatsByArea(sortBy),
    select: (data) => get(data, 'data.data') as IAreaStat[],
    staleTime: 5 * 60 * 1000,
  });

  return { data, ...args };
};
