import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { GetOverview } from '../api';

export const useOverview = () => {
  const { data, ...args } = useQuery({
    queryKey: ['overview'],
    queryFn: () => GetOverview(),
    select: data => ({
      data: get(data, 'data.data'),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
