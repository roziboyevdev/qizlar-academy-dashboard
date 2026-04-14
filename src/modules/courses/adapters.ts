import type { Course, CourseInput } from './types';

export const getCourse = (item?: Course & { name?: string; bannerImage?: string }) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const title = item?.title ?? (anyItem?.name as string) ?? '';
  const banner = item?.banner ?? (anyItem?.bannerImage as string) ?? '';
  const shortDescription = (anyItem?.shortDescription as string) ?? (item as any)?.shortDescription ?? '';

  return {
    id: item?.id ?? '',
    slug: item?.slug ?? '',
    title,
    description: item?.description ?? '',
    shortDescription,
    icon: item?.icon ?? '',
    pricingType: item?.pricingType ?? 'FREE',
    isActive: item?.isActive ?? false,
    planLessonCount: item?.planLessonCount ?? undefined,
    type: item?.type ?? undefined,
    degree: item?.degree ?? undefined,
    price: item?.price ?? undefined,
    audioLink: item?.audioLink ?? undefined,
    teacherId: item?.teacherId ?? '',
    banner,
    seoKeywords: item?.seoKeywords ?? [''],
    seo: item?.seo ? item?.seo : null,
    ratingCount: item?.ratingCount ?? 0,
  };
};

export const getCoursesList = (data?: Course[]) => {
  return data?.length
    ? data.map((item) => {
      return getCourse(item);
    })
    : [];
};

/** Jadvaldan statusni PATCH qilish uchun — boshqa maydonlar APIda bo‘sh qolib ketmasin */
export const courseToEditPayload = (course: Course, overrides: Partial<CourseInput> = {}): CourseInput => ({
  title: course.title,
  description: course.description,
  slug: course.slug,
  icon: course.icon,
  banner: course.banner,
  teacherId: course.teacherId,
  pricingType: course.pricingType,
  isActive: course.isActive,
  planLessonCount: course.planLessonCount,
  type: course.type,
  degree: course.degree,
  price: course.price,
  audioLink: course.audioLink,
  seoTitle: course.seo?.title,
  seoDescription: course.seo?.description,
  seoKeywords: course.seo?.keywords ?? course.seoKeywords,
  ...overrides,
});
