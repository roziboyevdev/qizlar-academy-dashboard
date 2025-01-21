import { z } from 'zod';


export const schema = z.object({
  title: z.string().min(3, { message: 'Hikoya nomi talab qilinadi' }),
  cover: z
    .union([
      z.custom<File>(file => file instanceof File, {
        message: 'Rasm talab qilinadi',
      }),
      z.string(),
    ])
    .optional(),
  link: z.string().min(3, { message: 'Hikoya linki talab qilinadi' }),
  // deadline: z.string({ message: "Hikoya tugash vaqtini kiriting" }),
  video: z
    .union([
      z.custom<File>(file => file instanceof File, {
        message: 'Video talab qilinadi',
      }),
      z.string(),
    ])
    .optional(),
});

export type useFormSchemaType = z.infer<typeof schema>;
