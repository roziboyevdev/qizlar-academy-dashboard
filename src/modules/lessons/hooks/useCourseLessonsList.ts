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
    select: (data) => {
      const lessonsList = getLessonsList(get(data, 'data.data.data', []));

      return {
        data: lessonsList,
        paginationInfo: get(data, 'data.data.meta.pagination', initialData.paginationInfo),
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
