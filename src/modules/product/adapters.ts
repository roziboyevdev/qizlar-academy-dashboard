import { ProductType } from './types';

type ApiProduct = ProductType & {
  basePrice?: number;
  thumbnail?: string | null;
  description?: string;
  variants?: { id?: string; stock?: { available?: number; quantity?: number } }[];
};

export const getData = (item?: ApiProduct) => {
  const variants = item?.variants ?? [];
  const stockQty = variants.reduce((acc, v) => acc + (v.stock?.available ?? v.stock?.quantity ?? 0), 0);

  return {
    id: item?.id ?? '',
    photo: item?.photo || item?.thumbnail || '',
    photos: item?.photos ?? [],
    title: item?.title ?? '',
    content: item?.content ?? item?.description ?? '',
    price: item?.price ?? item?.basePrice ?? 0,
    count: item?.count ?? stockQty,
    categoryId: item?.categoryId ?? '',
    isActive: item?.isActive ?? true,
    date: item?.date ?? (item as { createdAt?: string })?.createdAt ?? '',
  };
};

export const getDatasList = (data?: ApiProduct[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
