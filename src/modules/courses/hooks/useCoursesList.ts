import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getCoursesList } from '../adapters';
import { GetCoursesList } from '../api';

export type CoursesListFilters = {
  pageNumber?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
  teacherId?: string;
};

export const useCoursesList = (
  {
    currentPage,
    pageSize,
    isActive,
    search,
    teacherId,
    isEnabled = true,
  }: { currentPage?: number; pageSize?: number; isActive?: boolean; search?: string; teacherId?: string; isEnabled?: boolean } = {}
) => {
  const initialData = {
    data: getCoursesList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['courses_list', currentPage, pageSize, isActive, search, teacherId],
    queryFn: () =>
      GetCoursesList({
        pageNumber: currentPage,
        pageSize,
        isActive,
        search,
        teacherId,
      }),
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




