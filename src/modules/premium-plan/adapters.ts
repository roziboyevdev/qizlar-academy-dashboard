import { PremiumPlan } from "./types";
export const getData = (item?: PremiumPlan) => {
  return {
    id: item?.id ?? "",
    title: item?.title ?? "",
    price: item?.price ?? 0,
    duration_in_days: item?.duration_in_days ?? 0,
    properties: item?.properties ?? [],
    is_visible: item?.is_visible ?? false,
    date: item?.date ?? "",
  };
};

export const getDatasList = (data?: PremiumPlan[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
