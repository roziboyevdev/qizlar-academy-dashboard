import { Notification } from './types';

export const getNotification = (item?: Notification & { imageUrl?: string; bannerImage?: string }) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const candidates = [item?.photo, anyItem?.imageUrl, anyItem?.bannerImage];
  const photo =
    candidates
      .map((v) => (typeof v === 'string' ? v : v != null ? String(v) : ''))
      .find((s) => s.trim().length > 0) ?? '';

  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    content: item?.content ?? '',
    body: item?.body ?? '',
    photo,
    type: item?.type,
    objectId: item?.objectId ?? (typeof anyItem?.targetId === 'string' ? anyItem.targetId : null) ?? null,
    link: item?.link ?? null,
    createdAt: item?.createdAt ?? '',
    deliveredCount: item?.deliveredCount ?? 0,
    openedCount: item?.openedCount ?? 0,
  };
};

export const getNotificationsList = (data?: Notification[]) => {
  return data?.length
    ? data.map((item) => {
        return getNotification(item);
      })
    : [];
};
