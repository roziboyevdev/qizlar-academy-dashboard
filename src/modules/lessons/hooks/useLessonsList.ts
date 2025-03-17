import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";

import { getLessonsList } from "../adapters";
import { GetLessonsList } from "../api";

export const useLessonsList = (moduleId: string, currentPage: number) => {
  const initialData = {
    data: [],
    paginationInfo: {
      total_pages: 1,
      prev_page: 0,
      next_page: 0,
      current_page: 1,
      total_records: 0,
    },
  };

  const { data = initialData, ...args } = useQuery({
    queryKey: ["lessons_list", moduleId, currentPage],
    queryFn: () => GetLessonsList(moduleId, currentPage),
    select: (data) => {
      const lessonsList = getLessonsList(get(data, "data.data.data", []));

      return {
        data: lessonsList,
        paginationInfo: get(
          data,
          "data.data.meta.pagination",
          initialData.paginationInfo
        ),
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
