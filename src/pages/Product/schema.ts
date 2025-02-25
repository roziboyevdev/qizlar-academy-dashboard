import { z } from "zod";

export const fileType = z
  .union([
    z.custom<File>((file) => file instanceof File, {
      message: "Rasm talab qilinadi",
    }),
    z.string(),
  ])
  .optional();
export const schema = z.object({
  title: z.string().min(3, { message: "Malumot nomi talab qilinadi" }),
  photo: fileType,
  photo1: fileType,
  photo2: fileType,
  photo3: fileType,
  photo4: fileType,
  photo5: fileType,
  content: z.string().min(3, { message: "Kontent  talab qilinadi" }),
  price: z.union([z.number(), z.string()]),
  count: z.union([z.number(), z.string()]),
  isActive: z.boolean().optional(),
});

export type useFormSchemaType = z.infer<typeof schema>;
