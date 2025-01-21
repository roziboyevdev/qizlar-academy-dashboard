import http from 'services/api';
import { NotificationEditBody, NotificationInput } from './types';

export const GetNotificationsList = async () => {
  return await http.get(`/notification/all/`);
};

export const CreateNotification = async (values: NotificationInput) => {
  return await http.post(`/notification/send`, values);
};

export const EditNotification = async ({
  values,
  id,
}: NotificationEditBody) => {
  return await http.patch(`/notification/${id}`, values);
};

export const DeleteNotification = async (id: string) => {
  return await http.delete(`/notification/${id}`);
};
