import { Afisha } from './types';
export const getAfisha = (item?: Afisha) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    content: item?.content ?? '',
    short_description: item?.short_description ?? '',
    photo: item?.photo ?? '',
    date: item?.date ?? '',
  };
};

export const getAfishaList = (data?: Afisha[]) => {
  return data?.length
    ? data.map(item => {
        return getAfisha(item);
      })
    : [];
};
