import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";

import { getLessonsList } from "../adapters";
import { GetLessonsList } from "../api";

export const useLessonsList = (moduleId: string, currentPage: number, courseId?: string) => {
  const initialData = {
    data: [],
    paginationInfo: null,
  };

  const { data = initialData, ...args } = useQuery({
    queryKey: ["lessons_list", moduleId, currentPage, courseId],
    queryFn: () => GetLessonsList(moduleId, currentPage, courseId),
    select: (data) => {
      const raw = get(data, 'data.data.data') ?? get(data, 'data.data') ?? [];
      const lessonsList = getLessonsList(raw);

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
