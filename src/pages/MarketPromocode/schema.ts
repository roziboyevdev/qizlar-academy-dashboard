import { z } from 'zod';

export const schema = z.object({
  productId: z.string({ message: 'Mahsulotni tanlang' }),
  file: z.union([
    z.custom<File>((file) => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(2, { message: 'Banner  type talab qilinadi' }),
  ]),
});

export type useFormSchemaType = z.infer<typeof schema>;
