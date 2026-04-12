import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { GetMonthlyOverview } from '../api';

export interface MonthlyActiveUsersRow {
  month: string;
  monthName: string;
  count: number;
}

export const useMonthlyOverview = () => {
  const { data, ...args } = useQuery({
    queryKey: ['monthly-overview'],
    queryFn: () => GetMonthlyOverview(),
    select: (res) => get(res, 'data.data', []) as MonthlyActiveUsersRow[],
  });

  return {
    data,
    ...args,
  };
};
