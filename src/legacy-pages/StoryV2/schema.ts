import { z } from 'zod';
import { MediaType } from 'modules/story-v2/types';
import { imageTypes, videoTypes } from 'constants/file';

const isValidFileType = (file: File, validTypes: string[]) => {
  if (!file) return false;
  const fileExtension = file.name.split('.').pop()?.toUpperCase();
  return fileExtension ? validTypes.includes(fileExtension) : false;
};

const mediaUrlSchema = z.union([
  z.custom<File>(
    (file) => file instanceof File && (isValidFileType(file, imageTypes) || isValidFileType(file, videoTypes)),
    {
      message: `Fayl turi ${[...imageTypes, ...videoTypes].join(', ')} dan biri bo'lishi kerak`,
    }
  ),
  z.string().min(1, { message: 'Media URL yoki fayl kerak' }),
]);

export const schema = z
  .object({
    title: z.string().max(128, { message: "Sarlavha 128 belgidan oshmasligi kerak" }).optional(),
    mediaType: z.nativeEnum(MediaType, {
      errorMap: () => ({ message: "Media turi IMAGE yoki VIDEO bo'lishi kerak" }),
    }),
    mediaUrl: mediaUrlSchema,
    expiresAt: z.string().min(1, { message: 'Tugash vaqti (expiresAt) kiritilishi kerak' }),
  })
  .superRefine((data, ctx) => {
    if (!(data.mediaUrl instanceof File)) return;
    if (data.mediaType === MediaType.IMAGE && !isValidFileType(data.mediaUrl, imageTypes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaUrl'],
        message: `Rasm uchun fayl turi: ${imageTypes.join(', ')}`,
      });
    }
    if (data.mediaType === MediaType.VIDEO && !isValidFileType(data.mediaUrl, videoTypes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaUrl'],
        message: `Video uchun fayl turi: ${videoTypes.join(', ')}`,
      });
    }
  });

export type useFormSchemaType = z.infer<typeof schema>;
