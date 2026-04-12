import http from 'services/api';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { AuthType, AreaSortBy } from './types';

const toYmd = (d?: Date) => (d ? format(d, 'yyyy-MM-dd') : '');

export const GetOverview = async () => {
  return await http.get(`/statistics/main`);
};

export const GetNewUsers = async (date?: DateRange) => {
  const startDate = toYmd(date?.from);
  const endDate = toYmd(date?.to);
  return await http.get(`/statistics/daily-user-count`, { params: { startDate, endDate } });
};

export const GetMonthlyOverview = async (date?: DateRange) => {
  const endDate = toYmd(date?.to) || toYmd(new Date());
  const startDate = toYmd(date?.from) || toYmd(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  return await http.get(`/statistics/monthly-active-users`, { params: { startDate, endDate } });
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetDalyDonation = async (date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/donation/daily`, { params: { startDate, endDate } });
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetDalyCertificateCount = async (date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/daily/certificate/statistics`, { params: { startDate, endDate } });
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetUsersByAuthMethod = async (type: AuthType, date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/users/authMethod`, { params: { startDate, endDate, type } });
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetUsersByHalfCompletedCourses = async (type: AuthType, date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/users/with/half/complete/course`, { params: { startDate, endDate, type } });
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetLessonStatistics = async () => {
  return await http.get(`/statistics/by/lesson`);
};

/** Eski backend; yangi API da mos keluvchi endpoint yo'q. */
export const GetCoinStatistics = async (from?: number, to?: number) => {
  return await http.get(`/statistics/by/coin`, { params: { from, to } });
};

/** Viloyatlar kesimida statistika */
export const GetStatsByArea = async (sortBy: AreaSortBy = 'profiles') => {
  return await http.get(`/statistics/count-by-area`, { params: { sortBy } });
};

/** Tumanlar kesimida statistika */
export const GetStatsByDistrict = async (params: {
  sortBy?: AreaSortBy;
  regionId?: number;
  pageNumber?: number;
  pageSize?: number;
}) => {
  return await http.get(`/statistics/count-by-district`, { params });
};

/** Mahallalar kesimida statistika */
export const GetStatsByNeighborhood = async (params: {
  sortBy?: AreaSortBy;
  districtId?: number;
  pageNumber?: number;
  pageSize?: number;
}) => {
  return await http.get(`/statistics/count-by-neighborhood`, { params });
};
