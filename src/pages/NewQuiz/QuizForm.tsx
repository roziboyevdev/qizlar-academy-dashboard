'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormDescription, FormMessage } from 'components/ui/form';
import LoadingButton from 'components/LoadingButton';
import QuizOptions from './QuizOptions';
import { useParams } from 'react-router-dom';

import RichTextEditorForQuiz from 'components/fields/RichTextEditorForQuiz';
import { useCreateQuiz } from 'modules/quizzes/hooks/useCreateQuiz';
import { useEditQuiz } from 'modules/quizzes/hooks/useEditQuiz';

import { useEffect, useState } from 'react';
import http from 'services/api';
import { Quiz, QuizOptionType } from 'modules/quizzes/types';
import { SelectField } from 'components/fields';
import { useEasyFileUploader } from 'hooks/useFileUploader';

const typeData = [
  { type: QuizOptionType.TEXT, name: 'Matn' },
  { type: QuizOptionType.AUDIO, name: 'Audio' },
  { type: QuizOptionType.IMAGE, name: 'Rasm' },
];



const quizSchema = z.object({
  question: z.string().min(9, { message: "Savol minimum 8 ta harifdan iborat bolishi kerak" }),
  type: z.nativeEnum(QuizOptionType).default(QuizOptionType.TEXT),
  options: z
    .array(
      z.object({
        value: z.string().optional(),
        link: z.union([z.string(), z.instanceof(File)]).optional(),
        isCorrect: z.boolean(),
        id: z.string().optional(),
      })
    )
    .refine((data) => data.some((option) => option.isCorrect), {
      message: "To'g'ri javobni belgilang",
      path: ["options"],
    }),
});

export type quizFormSchema = z.infer<typeof quizSchema>;

interface IProps {
  quiz?: Quiz;
  setSheetOpen: (state: boolean) => void;
}

export default function QuizForm({ quiz, setSheetOpen }: IProps) {
  const [loading, setLoading] = useState(false);
  const { lessonId } = useParams();
  const { uploadFile: easyUpload } = useEasyFileUploader();
  const { triggerQuizCreate, isPending: isQuizCreatePending } = useCreateQuiz({ setSheetOpen });
  const { triggerQuizEdit, isPending: isQuizEditPending } = useEditQuiz({ setSheetOpen });

  const defaultOptions = () => [
    { isCorrect: false, type: QuizOptionType.TEXT },
    { isCorrect: false, type: QuizOptionType.TEXT },
    { isCorrect: false, type: QuizOptionType.TEXT },
    { isCorrect: false, type: QuizOptionType.TEXT },
  ];

  const form = useForm<quizFormSchema>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      question: quiz?.question || '',
      type: quiz?.type || QuizOptionType.TEXT,
      options: quiz?.options?.length ? quiz.options : defaultOptions(),
    },
  });

  const {
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (!quiz?.id) {
      reset({
        question: '',
        type: QuizOptionType.TEXT,
        options: defaultOptions(),
      });
      return;
    }

    setLoading(true);
    http
      .get(`/quiz/${quiz.id}`)
      .then((res) => {
        const dto = res.data?.data ?? res.data;
        if (res.status !== 200 || !dto) return;

        const rawOpts = dto.options ?? dto.quizOptions ?? [];
        const quizOptions =
          Array.isArray(rawOpts) && rawOpts.length
            ? rawOpts.map((opt: Record<string, unknown>) => ({
                id: opt.id as string | undefined,
                value: (opt.value as string) || '',
                link: (opt.link as string) || '',
                type: (opt.type as QuizOptionType) || QuizOptionType.TEXT,
                isCorrect: !!opt.isCorrect,
              }))
            : defaultOptions();

        let nextType = quiz.type || QuizOptionType.TEXT;
        const first = quizOptions[0];
        if (first?.type === QuizOptionType.IMAGE || first?.type === QuizOptionType.AUDIO || first?.type === QuizOptionType.TEXT) {
          nextType = first.type;
        } else if (dto.mediaType === 'IMAGE' || dto.mediaType === 'AUDIO' || dto.mediaType === 'TEXT') {
          nextType = dto.mediaType as QuizOptionType;
        }

        reset({
          question: typeof dto.question === 'string' ? dto.question : quiz.question || '',
          type: nextType,
          options: quizOptions,
        });
      })
      .catch(() => alert('Savollarni olishda xatolik'))
      .finally(() => setLoading(false));
  }, [quiz?.id, quiz?.type, quiz?.question, reset]);

  async function onSubmit(formValues: quizFormSchema) {
    try {
      // Process files
      const processedOptions = await Promise.all(
        formValues.options.map(async (option) => {
          const processedOption = { ...option, type: formValues.type };
          if (option.link && option.link instanceof File) {
            const url = await easyUpload(option.link);
            processedOption.link = url;
          }
          return processedOption;
        })
      );

      const finalPayload = { ...formValues, options: processedOptions, lessonId: lessonId! };

      if (quiz?.id) {
        await triggerQuizEdit({ id: quiz.id, values: finalPayload });
      } else {
        await triggerQuizCreate(finalPayload);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <RichTextEditorForQuiz name="question" label="Savol" required />
          <SelectField name="type" data={typeData} placeholder="Javob turini tanlang..." label="Javob turi" />
          <hr />
          <FormDescription className="mb-2 text-xs">Bitta to'g'ri javobni belgilang</FormDescription>
          {loading && <h3>Javoblar yuklanmoqda...</h3>}
          <QuizOptions />
          {errors.options && <FormMessage className="text-red-600">{errors.options.message}</FormMessage>}
        </div>

        <LoadingButton isLoading={quiz ? isQuizEditPending : isQuizCreatePending}>
          {quiz ? 'Tahrirlash' : 'Saqlash'}
        </LoadingButton>
      </form>
    </Form>
  );
}
