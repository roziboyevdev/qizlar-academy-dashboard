import { Lesson, LessonLinkType } from './types';

export const getLesson = (item?: Lesson) => {
  const anyItem = item as any;
  const name = item?.name ?? anyItem?.title ?? '';
  const photo = item?.photo ?? anyItem?.thumbnail ?? '';
  const orderIndex = item?.orderIndex ?? anyItem?.orderId ?? 0;

  return {
    ...item,
    id: item?.id ?? '',
    name,
    title: name,
    description: item?.description ?? '',
    link: item?.link ?? '',
    photo,
    thumbnail: photo,
    moduleId: item?.moduleId ?? '',
    duration: item?.duration ?? 0,
    linkType: item?.linkType ?? LessonLinkType.YOU_TUBE,
    orderIndex,
    orderId: orderIndex,
    isSoon: item?.isSoon ?? false,
    isActive: item?.isActive ?? true,
  };
};

export const getLessonsList = (data?: Lesson[]) => {
  return data?.length
    ? data.map((item) => {
        return getLesson(item);
      })
    : [];
};