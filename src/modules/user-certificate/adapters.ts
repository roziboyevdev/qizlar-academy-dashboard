import { UserCertificate } from './types';
export const getData = (item?: UserCertificate) => {
  console.log(item?.profile);
  
  return {
    id: item?.id ?? '',
    profile: item?.profile ? item?.profile : {
      first_name:'',
      last_name:'',
      address:{
        country:'',
        region:'',
        district:'',
        neighborhood:''
      }
    },
    user: item?.user ? item?.user : {
      phone_number:'',
      email:''
    },
    course: item?.course ? item?.course : [{name:''}],
  };
};

export const getDatasList = (data?: UserCertificate[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
