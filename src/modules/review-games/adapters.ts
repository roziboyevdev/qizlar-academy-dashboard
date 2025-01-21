import { ReviewGame } from './types';

export const getReviewGame = (item?: ReviewGame) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    thumbnail: item?.thumbnail ?? '',
    short_description: item?.short_description ?? '',
    description: item?.description ?? '',
    youtube_link: item?.youtube_link ?? '',
    date: item?.date ?? '',
  };
};

export const getReviewGamesList = (data?: ReviewGame[]) => {
  return data?.length
    ? data.map(item => {
        return getReviewGame(item);
      })
    : [];
};
