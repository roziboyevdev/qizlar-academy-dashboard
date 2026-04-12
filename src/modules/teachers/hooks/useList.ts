import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { GetDatasList } from '../api';

export const useTeachersList = (pageNumber:number,pageSize:number) => {
  const initialData = {
    data: getDatasList(),
    pagenationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['teachers_list',pageNumber , pageSize],
    queryFn: () => GetDatasList(pageNumber , pageSize),
    select: (res) => ({
      data: getDatasList(
        get(res, 'data.data.data') ?? get(res, 'data.data') ?? []
      ),
      pagenationInfo: get(res, 'data.data.meta.pagination') ?? get(res, 'data.meta.pagination'),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
