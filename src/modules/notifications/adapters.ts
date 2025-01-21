import { Notification } from './types';
export const getNotification = (item?: Notification) => {
  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    body: item?.body ?? '',
    image: item?.image ?? '',
    type: item?.type,
    entityid: item?.entityid ?? '',
    date: item?.date ?? '',
  };
};

export const getNotificationsList = (data?: Notification[]) => {
  return data?.length
    ? data.map(item => {
        return getNotification(item);
      })
    : [];
};
