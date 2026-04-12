import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { GetDatasList } from '../api';

export const useStoriesList = () => {
  const initialData = {
    data: getDatasList(),
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['stories_list'],
    queryFn: () => GetDatasList(),
    select: (res) => {
      const inner = get(res, 'data.data') as { data?: unknown[] } | unknown[] | undefined;
      const raw = Array.isArray(inner) ? inner : inner?.data ?? [];
      const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
      return {
        data: getDatasList(list),
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
