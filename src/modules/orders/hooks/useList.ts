import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { GetDatasList, SearchCourseId, SearchUserId } from '../api';

export interface OrderListFilters {
  status?: string;
}

export const useOredersList = (currentPage: number, filters: OrderListFilters) => {
  const initialData = {
    data: getDatasList(),
    pagenationInfo: {
      count: 0,
      pageCount: 0,
      pageNumber: 1,
      pageSize: 10,
    },
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['order_list', currentPage, filters],
    queryFn: () => GetDatasList(currentPage, filters),
    select: (res) => ({
      data: getDatasList(get(res, 'data.data.data')),
      pagenationInfo: get(res, 'data.data.meta.pagination', initialData.pagenationInfo),
    }),
  });
  return {
    ...data,
    ...args,
  };
};

export const useSearchCoursesId = (search: string) => {
  return useQuery({
    queryKey: ['search-courses', search],
    queryFn: async () => {
      const res = await SearchCourseId(search);
      return get(res, 'data.data') || [];
    },
    enabled: Boolean(search?.trim()),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchUserId = (search: string) => {
  return useQuery({
    queryKey: ['search-users', search],
    queryFn: async () => {
      const res = await SearchUserId(search);
      return get(res, 'data.data') || [];
    },
    enabled: Boolean(search?.trim()),
    staleTime: 1000 * 60 * 5,
  });
};
