import { Donation } from './types';
export const getData = (item?: Donation) => {
  console.log(item?.profile);
  
  return {
    id: item?.id ?? '',
    amount: item?.amount ?? 0,
    provider: item?.provider ?? '',
    profile: item?.profile ? item?.profile : {
      first_name:'',
      last_name:'',
      source:'',
    },
    date: item?.date ?? '',
  };
};

export const getDatasList = (data?: Donation[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
