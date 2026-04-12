import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getVacanciesList } from '../adapters';
import { GetVacanciesList } from '../api';
import type { VacancyListQuery } from '../types';

export const useVacanciesList = ({ currentPage, ...query }: VacancyListQuery & { currentPage?: number } = {}) => {
  const params: VacancyListQuery = { ...query, pageNumber: currentPage };
  const initialData = {
    data: getVacanciesList(),
    paginationInfo: null,
  };
  const { data = initialData, ...args } = useQuery({
    queryKey: ['vacancies_list', currentPage, query],
    queryFn: () => GetVacanciesList(params),
    select: (res) => {
      const inner = get(res, 'data.data') as { data?: unknown[] } | unknown[] | undefined;
      const raw = Array.isArray(inner) ? inner : inner?.data ?? [];
      const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
      return {
        data: getVacanciesList(list as unknown[]),
        paginationInfo: get(res, 'data.data.meta.pagination', initialData.paginationInfo),
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
