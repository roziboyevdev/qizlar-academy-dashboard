import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { getDatasList } from '../adapters';
import { CERTIFICATE_USERS_PAGE_SIZE, GetDatasList } from '../api';
import type { CertificateUserListFilters, IUserCertificate } from '../types';

type PaginationSlice = {
  totalCountKnown: boolean;
  pagenationInfo: {
    total_pages: number;
    prev_page: number;
    next_page: number;
    current_page: number;
    count: number;
    pageCount: number;
    pageNumber: number;
    pageSize: number;
  };
};

const emptyPagination = (): PaginationSlice['pagenationInfo'] => ({
  total_pages: 0,
  prev_page: 0,
  next_page: 0,
  current_page: 1,
  count: 0,
  pageCount: 0,
  pageNumber: 1,
  pageSize: CERTIFICATE_USERS_PAGE_SIZE,
});

export const useUserCertificateList = (
  currentPage: number,
  courseId?: string,
  regionId?: string,
  districtId?: string,
  filters?: CertificateUserListFilters
) => {
  const initialData: PaginationSlice & { data: ReturnType<typeof getDatasList> } = {
    data: getDatasList(),
    totalCountKnown: false,
    pagenationInfo: emptyPagination(),
  };

  const { data = initialData, ...args } = useQuery({
    queryKey: ['user_certificate_list', currentPage, courseId, regionId, districtId, filters],
    queryFn: () =>
      GetDatasList({
        pageNumber: currentPage,
        pageSize: CERTIFICATE_USERS_PAGE_SIZE,
        courseId,
        regionId,
        districtId,
        filters,
      }),
    select: (res): PaginationSlice & { data: ReturnType<typeof getDatasList> } => {
      const payload = get(res, 'data.data') as unknown;
      let list: unknown[] = [];
      let serverPagination = get(res, 'data.meta.pagination') as
        | { count?: number; pageCount?: number; pageNumber?: number; pageSize?: number }
        | undefined;

      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === 'object') {
        const wrapped = payload as { data?: unknown[]; meta?: { pagination?: typeof serverPagination } };
        if (Array.isArray(wrapped.data)) list = wrapped.data;
        serverPagination = wrapped.meta?.pagination ?? serverPagination;
      }

      const pageSize = serverPagination?.pageSize ?? CERTIFICATE_USERS_PAGE_SIZE;
      const pageNumber = serverPagination?.pageNumber ?? currentPage;

      if (serverPagination && typeof serverPagination.count === 'number' && typeof serverPagination.pageCount === 'number') {
        return {
          data: getDatasList(list as Partial<IUserCertificate>[]),
          totalCountKnown: true,
          pagenationInfo: {
            total_pages: serverPagination.pageCount,
            prev_page: Math.max(1, pageNumber - 1),
            next_page: Math.min(serverPagination.pageCount, pageNumber + 1),
            current_page: pageNumber,
            count: serverPagination.count,
            pageCount: serverPagination.pageCount,
            pageNumber,
            pageSize: serverPagination.pageSize ?? pageSize,
          },
        };
      }

      const len = list.length;
      const hasNext = len === pageSize;
      const pageCount = hasNext ? currentPage + 1 : Math.max(1, currentPage);
      const knownMin = (currentPage - 1) * pageSize + len;

      return {
        data: getDatasList(list as Partial<IUserCertificate>[]),
        totalCountKnown: false,
        pagenationInfo: {
          total_pages: pageCount,
          prev_page: Math.max(1, currentPage - 1),
          next_page: Math.min(pageCount, currentPage + 1),
          current_page: currentPage,
          count: knownMin,
          pageCount,
          pageNumber: currentPage,
          pageSize,
        },
      };
    },
  });

  return {
    ...data,
    ...args,
  };
};
