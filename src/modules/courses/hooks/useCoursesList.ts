import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getCoursesList } from '../adapters';
import { GetCoursesList } from '../api';




export const useCoursesList = ({ currentPage, isEnabled = true, }: { currentPage?: number, isEnabled?: boolean } = {}) => {
  const initialData = {
    data: getCoursesList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['courses_list', currentPage],
    queryFn: () => GetCoursesList(currentPage),
    select: (res) => ({
      data: getCoursesList(get(res, 'data.data.data') ?? get(res, 'data.data') ?? []),
      paginationInfo: get(res, 'data.data.meta.pagination', initialData.paginationInfo),
    }),
    enabled: isEnabled,
  });

  return {
    ...data,
    ...args,
  };
};




