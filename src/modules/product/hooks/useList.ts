import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { GetDatasList } from '../api';
import { ProductType } from '../types';

export const useProductsList = (id:string) => {
  const initialData = {
    data: getDatasList() ,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['products_list'],
    queryFn: () => GetDatasList(id),
    select: data => ({
      data: getDatasList(get(data, 'data.data.data')),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
