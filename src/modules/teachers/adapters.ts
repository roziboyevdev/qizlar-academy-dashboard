import { TeacherType } from './types';

export const getData = (item?: TeacherType) => {
  return {
    id: item?.id ?? '',
    fullname: item?.fullname ?? '',
    photo: item?.photo ?? '',
    bio: item?.bio ?? '',
    isActive: item?.isActive,
  };
};

export const getDatasList = (data?: TeacherType[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
