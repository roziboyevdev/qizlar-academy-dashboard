import { Banner } from './types';

const pickUrl = (...vals: unknown[]) =>
  vals
    .map((v) => (typeof v === 'string' ? v : v != null ? String(v) : ''))
    .find((s) => s.trim().length > 0) ?? '';

const pickFirstNonEmpty = (...vals: unknown[]) =>
  vals
    .map((v) => (typeof v === 'string' ? v : v != null ? String(v) : ''))
    .find((s) => s.trim().length > 0) ?? '';

export const getData = (item?: Banner & { imageUrl?: string; bannerImage?: string; mobileImage?: string; mobileBanner?: string }) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const targetId = pickFirstNonEmpty(item?.targetId, item?.objectId, anyItem?.targetId, anyItem?.objectId);

  return {
    id: item?.id ?? '',
    title: item?.title ?? '',
    content: item?.content ?? '',
    photo: pickUrl(item?.photo, anyItem?.imageUrl, anyItem?.bannerImage),
    mobilePhoto: pickUrl(
      item?.mobilePhoto,
      anyItem?.mobilePhoto,
      anyItem?.mobileImage,
      anyItem?.mobileBanner
    ),
    link: item?.link ?? '',
    targetId,
    // Legacy UI joylarida ishlashi uchun
    objectId: targetId,
    type: item?.type ?? undefined,
    location: item?.location ?? undefined,
    isActive: item?.isActive ?? (typeof anyItem?.isActive === 'boolean' ? anyItem.isActive : true),
  };
};

export const getDatasList = (data?: Banner[]) => {
  return data?.length
    ? data.map(item => {
      return getData(item);
    })
    : [];
};
