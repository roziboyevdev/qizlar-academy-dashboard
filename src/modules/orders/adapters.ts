import type { IOrder, OrderAdminStatus } from './types';

type PromoRef = { code?: string } | null | undefined;

export interface OrderListItemApi {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  status: OrderAdminStatus;
  createdAt: string;
  promoCode?: PromoRef;
}

export const getData = (item?: OrderListItemApi) => {
  const qty = item?.quantity ?? 0;
  const unit = item?.unitPrice ?? 0;
  const promo = item?.promoCode as { code?: string } | null | undefined;

  return {
    id: item?.id ?? '',
    orderId: 0,
    price: unit * qty,
    comment: promo?.code ?? '',
    status: (item?.status as OrderAdminStatus) ?? 'PENDING',
    user: item?.userId
      ? {
          firstname: 'Foydalanuvchi',
          lastname: '',
          phone: item.userId,
          email: '',
        }
      : null,
    product: {
      title: `Variant ${(item?.variantId ?? '').slice(0, 12) || '—'}`,
      count: qty,
    },
    createdAt: item?.createdAt ?? '',
  };
};

export const getDatasList = (data?: OrderListItemApi[]) => {
  return data?.length ? data.map((item) => getData(item)) : [];
};
