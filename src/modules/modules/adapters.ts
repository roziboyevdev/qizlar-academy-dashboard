import { Module } from './types';

export const getModule = (item?: Module & { name?: string }) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const title = item?.title ?? (anyItem?.name as string) ?? '';
  const description = (anyItem?.description as string) ?? item?.description ?? '';
  const icon = (anyItem?.icon as string) ?? item?.icon ?? '';

  return {
    id: item?.id ?? '',
    title,
    courseId: item?.courseId ?? '',
    description,
    icon,
    isActive: item?.isActive ?? false,
  };
};

export const getModulesList = (data?: Module[]) => {
  return data?.length
    ? data.map(item => {
      return getModule(item);
    })
    : [];
};
