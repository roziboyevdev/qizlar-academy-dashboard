import { CategoryType } from './types';

type ApiCategory = CategoryType & { name?: string };

export const getData = (item?: ApiCategory) => {
  const title = item?.title ?? item?.name ?? '';
  return {
    id: item?.id ?? '',
    title,
    isActive: item?.isActive ?? true,
    date: item?.date ?? '',
    slug: (item as { slug?: string })?.slug,
  };
};

export const getDatasList = (data?: ApiCategory[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
