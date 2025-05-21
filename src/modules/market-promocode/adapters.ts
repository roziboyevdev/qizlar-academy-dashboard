import { IMarketPromocode } from './types';
export const getData = (item?: IMarketPromocode) => {
  return {
    id: item?.id ?? '',
    productId: item?.productId ?? '',
    file: item?.file ?? '',
  };
};

export const getDatasList = (data?: IMarketPromocode[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
