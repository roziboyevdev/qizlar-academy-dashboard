import { ICourseReward } from './types';
export const getData = (item?: ICourseReward) => {
  return {
    id: item?.id ?? '',
    courseId: item?.courseId ?? '',
    lessonId: item?.lessonId ?? '',
    rewardId: item?.rewardId ?? '',
    file: item?.file ?? '',
  };
};

export const getDatasList = (data?: ICourseReward[]) => {
  return data?.length
    ? data.map((item) => {
        return getData(item);
      })
    : [];
};
