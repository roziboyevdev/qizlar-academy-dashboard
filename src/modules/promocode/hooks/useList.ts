import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import type { IPromocode } from '../types';
import { GetPromocodesList } from '../api';
import { getPromocodesList } from '../adapters';

export const usePromocodesList = ({
  productId = '',
  isUsed,
  isEnabled = true,
}: {
  productId?: string;
  isUsed?: boolean;
  isEnabled?: boolean;
} = {}) => {
  const initialData = {
    data: getPromocodesList(),
    paginationInfo: null,
  };

  const { data = initialData, ...args } = useQuery({
    queryKey: ['promocodes_list', productId, isUsed],
    queryFn: () => GetPromocodesList({ productId: productId!, isUsed }),
    select: (res) => ({
      data: getPromocodesList(get(res, 'data.data') as IPromocode[] | undefined),
      paginationInfo: null as null,
    }),
    enabled: isEnabled && Boolean(productId?.trim()),
  });

  return {
    ...data,
    ...args,
  };
};
