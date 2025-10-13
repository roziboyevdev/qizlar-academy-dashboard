import { z } from 'zod';

export const schema = z.object({
  courseId: z.string().min(1, { message: 'Kurs tanlanishi shart' }),
  lessonId: z.string().min(1, { message: 'Dars tanlanishi shart' }),
  rewardId: z.string().optional(),
  file: z
    .union([
      z.custom<File>((file) => file instanceof File),
      z.string(),
    ])
    .optional(),
}).refine(
  (data) => {
    // rewardId yoki file kamida bittasi bo'lishi kerak
    return !!data.rewardId || !!data.file;
  },
  {
    message: 'Mukofot ID yoki fayl yuklash majburiy',
    path: ['file'], // error qaysi fieldda ko'rsatilishi
  }
);

export type useFormSchemaType = z.infer<typeof schema>;