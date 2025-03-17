import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { GetDatasList } from '../api';

export const useCertificatesList = (currentPage:number) => {
  const initialData = {
    data: getDatasList(),
    paginationInfo: {
      total_pages: 1,
      prev_page: 0,
      next_page: 0,
      current_page: 1,
      total_records: 0,
    },
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['certificates_list',currentPage ],
    queryFn: () => GetDatasList(currentPage),
    select: data => ({
      data: getDatasList(get(data, 'data.data.data')),
      paginationInfo: get(
        data,
        "data.data.meta.pagination",
        initialData.paginationInfo
      ),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
