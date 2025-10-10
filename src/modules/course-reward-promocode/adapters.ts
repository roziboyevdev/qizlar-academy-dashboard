import { IRewardPromocode } from './types';
export const getData = (item?: IRewardPromocode) => {
  return {
    id: item?.id ?? '',
    rewardId: item?.rewardId ?? '',
    title: item?.title ?? '',
    total: item?.total ?? 0,
    unused: item?.unused ?? 0,
  };
};

export const getDatasList = (data?: IRewardPromocode[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
