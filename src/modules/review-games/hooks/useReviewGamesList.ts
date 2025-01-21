import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getReviewGamesList } from '../adapters';
import { GetReviewGamesList } from '../api';

export const useReviewGamesList = (currentPage: number) => {
  const initialData = {
    data: getReviewGamesList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['review-games_list'],
    queryFn: () => GetReviewGamesList(currentPage),
    select: data => ({
      data: getReviewGamesList(get(data, 'data.data.data')),
      paginationInfo: get(data, 'data.pagination'),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
