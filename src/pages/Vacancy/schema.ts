import { z } from 'zod';
import { VacancyCategory, VacancyCurrency, VacancyJobType } from 'modules/vacancy/types';

export const vacancySchema = z
  .object({
    title: z.string().min(2, { message: 'Nom kamida 2 belgi' }),
    companyName: z.string().optional(),
    description: z.string().min(10, { message: 'Tavsif kamida 10 belgi' }),
    requirements: z.string().min(10, { message: 'Talablar kamida 10 belgi' }),
    salaryFrom: z.coerce.number().min(0),
    salaryTo: z.coerce.number().min(0),
    category: z.nativeEnum(VacancyCategory),
    currency: z.nativeEnum(VacancyCurrency),
    location: z.string().min(1, { message: 'Joylashuv kiritilishi kerak' }),
    type: z.nativeEnum(VacancyJobType),
    contact: z.string().min(3, { message: 'Aloqa (telefon yoki email) kiritilishi kerak' }),
    skills: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.salaryTo < data.salaryFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['salaryTo'],
        message: 'Yuqori chegara past chegaradan kichik bo‘lmasligi kerak',
      });
    }
  });

export type vacancyFormSchema = z.infer<typeof vacancySchema>;
