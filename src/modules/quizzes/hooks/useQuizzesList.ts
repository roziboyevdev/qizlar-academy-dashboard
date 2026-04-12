import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getQuizzesList } from '../adapters';
import { GetQuizzesList } from '../api';

export const useQuizzesList = (lessonId: string) => {
  const initialData = {
    data: getQuizzesList(),
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['quizzes_list', lessonId],
    queryFn: () => GetQuizzesList(lessonId),
    enabled: !!lessonId,
    select: (axiosRes) => {
      const body = axiosRes?.data ?? {};
      const raw =
        get(axiosRes, 'data.data.data') ??
        get(axiosRes, 'data.data') ??
        get(body, 'data.data') ??
        get(body, 'data') ??
        (Array.isArray(body) ? body : []);
      const list = Array.isArray(raw) ? raw : [];
      return { data: getQuizzesList(list) };
    },
  });

  return {
    ...data,
    ...args,
  };
};
