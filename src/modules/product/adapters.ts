import { count } from "console";
import { ProductType } from "./types";
export const getData = (item?: ProductType) => {
  return {
    id: item?.id ?? "",
    photo: item?.photo ?? "",
    photos: item?.photos ?? [
      {
        id: "",
        photo: "",
      },
    ],
    title: item?.title ?? "",
    content: item?.content ?? "",
    price: item?.price ?? 0,
    count: item?.count ?? 0,
    categoryId: item?.categoryId ?? "",
    is_active: item?.is_active ?? false,
    date: item?.date ?? "",
  };
};

export const getDatasList = (data?: ProductType[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
