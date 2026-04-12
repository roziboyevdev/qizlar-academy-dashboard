import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { GetPromoCodeStats } from '../api';
import type { IPromocodeStatsRow } from '../types';

export const usePromoCodeStats = () => {
  return useQuery({
    queryKey: ['promo_code_stats'],
    queryFn: () => GetPromoCodeStats(),
    select: (res) => get(res, 'data.data', []) as IPromocodeStatsRow[],
  });
};
