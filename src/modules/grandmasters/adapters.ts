import { Grandmaster } from './types';
export const getGrandmaster = (item?: Grandmaster) => {
  return {
    id: item?.id ?? '',
    full_name: item?.full_name ?? '',
    description: item?.description ?? '',
    image: item?.image ?? '',
    video_url: item?.video_url ?? '',
  };
};

export const getGrandmastersList = (data?: Grandmaster[]) => {
  return data?.length
    ? data.map(item => {
        return getGrandmaster(item);
      })
    : [];
};
