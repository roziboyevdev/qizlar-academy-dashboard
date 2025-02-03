import { Notification } from './types';
export const getNotification = (item?: Notification) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    content: item?.content ?? '',
    photo: item?.photo ?? '',
    type: item?.type,
    entityid: item?.entityid ?? '',
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
