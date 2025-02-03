import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getAfishaList } from '../adapters';
import { GetAfishaList } from '../api';

export const useAfishaList = (currentPage: number) => {
  const initialData = {
    data: getAfishaList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['afisha_list'],
    queryFn: () => GetAfishaList(currentPage),
    select: data => ({
      data: getAfishaList(get(data, 'data.data.data')),
      paginationInfo: get(data, 'data.data.meta.pagination'),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
