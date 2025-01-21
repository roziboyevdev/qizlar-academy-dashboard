import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getLiveStreamsList } from '../adapters';
import { GetLiveStreamsList } from '../api';

export const useLiveStreamsList = () => {
  const initialData = {
    data: getLiveStreamsList(),
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['live-streams_list'],
    queryFn: () => GetLiveStreamsList(),
    select: data => ({
      data: getLiveStreamsList(get(data, 'data.data.data')),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
