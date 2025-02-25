import { DonationStatus, IOrder } from './types';
export const getData = (item?: IOrder) => {
  
  return {
    id: item?.id ?? '',
    orderId: item?.orderId ?? 0,
    price: item?.price ?? 0,
    comment: item?.comment ?? '',
    status: item?.status ?? DonationStatus.PENDING,
    createdAt: item?.createdAt ?? '',
  };
};

export const getDatasList = (data?: IOrder[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
