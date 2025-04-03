import http from 'services/api';
import { DateRange } from 'react-day-picker';


export const GetOverview = async () => {
  return await http.get(`/statistics/admin/main`);
};

export const GetNewUsers = async (date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/users/daily`, { params: { startDate, endDate } });
};

export const GetDalyDonation = async (date?: DateRange) => {
  const startDate = date?.from ? date.from?.toISOString() : '';
  const endDate = date?.to ? date.to?.toISOString() : '';
  return await http.get(`/statistics/donation/daily`, { params: { startDate, endDate } });
};


export const GetMonthlyOverview = async () => {
  const date = new Date().toISOString()
  return await http.get(`/statistics/main/monthly`, {params:{date}});
};
