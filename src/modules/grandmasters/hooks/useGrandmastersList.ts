import { useQuery } from "@tanstack/react-query";
import { get } from "lodash";

import { getGrandmastersList } from "../adapters";
import { GetGrandmastersList } from "../api";

export const useGrandmastersList = (currentPage: number) => {
  const initialData = {
    data: getGrandmastersList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ["grandmasters_list"],
    queryFn: () => GetGrandmastersList(currentPage),
    select: (data) => ({
      data: getGrandmastersList(get(data, "data.data.data")),
      paginationInfo: get(data, "data.data.data.meta.pagination"),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
