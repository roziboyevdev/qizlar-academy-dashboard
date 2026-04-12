import { BannerType } from 'modules/banner/types';
import http from 'services/api';
import { NotificationEditBody, NotificationInput } from './types';

/** POST/PATCH: `targetId` faqat kurs bildirishnomasi + tanlangan kurs ID bo'lsa; aks holda maydon yuborilmaydi. */
export function buildNotificationRequestBody(values: NotificationInput): Record<string, unknown> {
  const { objectId, ...rest } = values;
  const body: Record<string, unknown> = { ...rest };

  const trimmed =
    objectId !== undefined && objectId !== null ? String(objectId).trim() : '';

  if (values.type === BannerType.COURSE && trimmed) {
    body.targetId = trimmed;
  }

  return body;
}

export const GetNotificationsList = async (pageNumber: number, pageSize: number) => {
  return await http.get(`/notification/admin`, { params: { pageNumber, pageSize } });
};

export const GetNotificationsStatisticList = async (pageNumber: number, pageSize: number) => {
  return await http.get(`/notification/all/statistics`, { params: { pageNumber, pageSize } });
};

export const CreateNotification = async (values: NotificationInput) => {
  return await http.post(`/notification`, buildNotificationRequestBody(values));
};

export const SendUserPush = async (userId: string, values: any) => {
  return await http.post(`/notification/${userId}/push`, values);
};

export const EditNotification = async ({ values, id }: NotificationEditBody) => {
  return await http.patch(`/notification/${id}`, buildNotificationRequestBody(values));
};

export const DeleteNotification = async (id: string) => {
  return await http.delete(`/notification/${id}`);
};
