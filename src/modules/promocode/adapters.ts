import type { IPromocode } from './types';

export const getPromocode = (item?: IPromocode) => ({
  id: item?.id ?? '',
  productId: item?.productId ?? '',
  code: item?.code ?? '',
  isUsed: item?.isUsed ?? false,
  usedByUserId: item?.usedByUserId ?? null,
  usedAt: item?.usedAt ?? null,
});

export const getPromocodesList = (data?: IPromocode[]) => {
  return data?.length ? data.map((item) => getPromocode(item)) : [];
};
