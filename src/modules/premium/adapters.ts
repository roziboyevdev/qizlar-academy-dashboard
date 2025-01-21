import { Premium, User } from "./types";
export const getData = (item?: Premium) => {
  return {
    id: item?.id ?? "",
    user: item?.user ?? {
      id: "",
      phone_number: "",
      email: "",
    },
    plan: item?.plan ?? {
      id: "",
      title: "",
    },
    is_gift: item?.is_gift ?? false,
    from_date: item?.from_date ?? "",
    to_date: item?.to_date ?? "",
    amount: item?.amount ?? 0,
    date: item?.date ?? "",
  };
};

export const getDatasList = (data?: Premium[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};

// user adapter

export const getUserData = (item?: User) => {
  return {
    address: item?.address ?? null,
    balance: item?.balance ?? 0,
    birthday: item?.birthday ?? "",
    email: item?.email ?? null,
    first_name: item?.first_name ?? "",
    gender: item?.gender ?? "",
    image: item?.image ?? null,
    last_name: item?.last_name ?? "",
    onlineTime: item?.onlineTime ?? 0,
    phone_number: item?.phone_number ?? "",
    points: item?.points ?? 0,
    source: item?.source ?? "",
    user: item?.user ?? "",
  };
};

export const getUserDatasList = (data?: User[]) => {
  return data?.length
    ? data.map((item) => {
        return getUserData(item);
      })
    : [];
};
