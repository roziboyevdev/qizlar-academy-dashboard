import http from 'services/api';
import { cleanEmptyStrings } from 'utils/clearEmptyKeys';

import type { CertificateUserListFilters } from './types';

export const CERTIFICATE_USERS_PAGE_SIZE = 10;

const toOptionalNumber = (value?: string) => {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

export type GetCertificateUsersArgs = {
  pageNumber: number;
  pageSize?: number;
  courseId?: string;
  regionId?: string;
  districtId?: string;
  filters?: CertificateUserListFilters;
};

export const GetDatasList = async ({
  pageNumber,
  pageSize = CERTIFICATE_USERS_PAGE_SIZE,
  courseId,
  regionId,
  districtId,
  filters,
}: GetCertificateUsersArgs) => {
  const regionIdNum = toOptionalNumber(regionId);
  const districtIdNum = toOptionalNumber(districtId);

  return await http.get(`certificate/users`, {
    params: cleanEmptyStrings({
      pageNumber,
      pageSize,
      courseId: courseId && courseId !== '__all__' ? courseId : undefined,
      regionId: regionIdNum,
      districtId: districtIdNum,
      neighborhoodId: filters?.neighborhoodId,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      type: filters?.type,
      search: filters?.search?.trim() || undefined,
      status: filters?.status,
    }),
  });
};
