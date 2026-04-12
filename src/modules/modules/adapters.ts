import { Module } from './types';

export const getModule = (item?: Module & { name?: string }) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const title = item?.title ?? (anyItem?.name as string) ?? '';

  return {
    id: item?.id ?? '',
    title,
    courseId: item?.courseId ?? '',
    degree: item?.degree ?? '',
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
