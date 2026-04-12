import { z } from 'zod';

export const schema = z.object({
  fullname: z.string().min(2, { message: 'To‘liq ism kamida 2 belgi bo‘lishi kerak' }),
  photo: z
    .union([
      z.custom<File>((file) => file instanceof File, {
        message: 'Rasm talab qilinadi',
      }),
      z.string(),
    ])
    .optional(),
  bio: z.string().optional().default(''),
});

export type useFormSchemaType = z.infer<typeof schema>;
