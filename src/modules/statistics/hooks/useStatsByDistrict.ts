import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { GetStatsByDistrict } from '../api';
import type { IAreaStatPaginated, AreaSortBy } from '../types';

interface ApiResponse {
  data: {
    data: IAreaStatPaginated;
  };
}

export const useStatsByDistrict = (params: {
  sortBy?: AreaSortBy;
  regionId?: number;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const { data, ...args } = useQuery<ApiResponse, Error, IAreaStatPaginated>({
    queryKey: ['stats-by-district', params],
    queryFn: () => GetStatsByDistrict(params),
    select: (data) => get(data, 'data.data') as IAreaStatPaginated,
    enabled: !!params.regionId,
    staleTime: 5 * 60 * 1000,
  });

  return { data, ...args };
};
