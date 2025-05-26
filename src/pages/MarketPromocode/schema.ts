import { z } from 'zod';

export const schema = z.object({
  productId: z.string({ message: 'Mahsulotni tanlang' }),
  file: z.union([
    z.custom<File>((file) => file instanceof File, {
      message: 'File talab qilinadi',
    }),
    z.string().min(2, { message: 'File talab qilinadi' }),
  ]),
});

export type useFormSchemaType = z.infer<typeof schema>;

export const generateSchema = z.object({
  count: z.union([z.number(), z.string()]).optional(),
});

export type useGenerateSchemaType = z.infer<typeof generateSchema>;
