import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getQuizzesList } from '../adapters';
import { GetQuizzesList } from '../api';

export const useQuizzesList = (lessonId: string, currentPage: number) => {
  const initialData = {
    data: getQuizzesList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['exam_list', lessonId, currentPage],
    queryFn: () => GetQuizzesList(lessonId, currentPage),
    select: (res) => {
      const raw = get(res, 'data.data.data') ?? get(res, 'data.data') ?? [];
      const list = Array.isArray(raw) ? raw : [];
      return {
        data: getQuizzesList(list),
        paginationInfo: get(res, 'data.data.meta.pagination'),
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
