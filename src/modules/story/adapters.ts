import { StoryType } from './types';
export const getData = (item?: StoryType) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    link: item?.link ?? '',
    cover: item?.cover ?? '',
    deadline: item?.deadline ?? '',
    video: item?.video ?? '',
  };
};

export const getDatasList = (data?: StoryType[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
