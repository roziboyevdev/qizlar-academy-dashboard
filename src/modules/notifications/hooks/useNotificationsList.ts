import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getNotificationsList } from '../adapters';
import { GetNotificationsList } from '../api';

export const useNotificationsList = () => {
  const initialData = {
    data: getNotificationsList(),
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['notifications_list'],
    queryFn: () => GetNotificationsList(),
    select: data => ({
      data: getNotificationsList(get(data, 'data.data')),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
