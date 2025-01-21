import { LiveStream } from './types';
export const getLiveStream = (item?: LiveStream) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    thumbnail: item?.thumbnail ?? '',
    video_link: item?.video_link ?? '',
    starts_at: item?.starts_at ?? '',
    ends_at: item?.ends_at ?? '',
  };
};

export const getLiveStreamsList = (data?: LiveStream[]) => {
  return data?.length
    ? data.map(item => {
        return getLiveStream(item);
      })
    : [];
};
