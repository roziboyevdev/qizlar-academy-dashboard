import { Notification } from './types';
export const getNotification = (item?: Notification) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    content: item?.content ?? '',
    photo: item?.photo ?? '',
    type: item?.type,
    objectId: item?.objectId ?? null,
    link: item?.link ??  null,
    createdAt: item?.createdAt ?? '',
  };
};

export const getNotificationsList = (data?: Notification[]) => {
  return data?.length
    ? data.map(item => {
        return getNotification(item);
      })
    : [];
};
