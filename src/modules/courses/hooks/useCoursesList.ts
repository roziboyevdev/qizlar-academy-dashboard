import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getCoursesList } from '../adapters';
import { GetCoursesList } from '../api';

export const useCoursesList = ({ isEnabled = true }: { isEnabled?: boolean } = {}) => {
  const initialData = {
    data: getCoursesList(),
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['courses_list'],
    queryFn: () => GetCoursesList(),
    select: (data) => ({
      data: getCoursesList(get(data, 'data.data.data')),
    }),
    enabled: isEnabled,
  });

  return {
    ...data,
    ...args,
  };
};
