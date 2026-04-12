import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getLessonsList } from '../adapters';
import { GetCourseLessonsList } from '../api';

export const useCourseLessonsList = (courseId: string) => {
  const initialData = {
    data: [],
    paginationInfo: null,
  };

  const { data = initialData, ...args } = useQuery({
    queryKey: ['course_lessons_list', courseId],
    queryFn: () => GetCourseLessonsList(courseId),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => {
      const raw = get(data, 'data.data.data') ?? get(data, 'data.data') ?? [];
      const lessonsList = getLessonsList(raw);

      return {
        data: lessonsList,
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
