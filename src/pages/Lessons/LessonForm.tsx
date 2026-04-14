'use client';

import { z } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateLesson } from 'modules/lessons/hooks/useCreateLesson';
import { useEditLesson } from 'modules/lessons/hooks/useEditLesson';
import { Form } from 'components/ui/form';
import { Lesson, LessonInput, LessonLinkType } from 'modules/lessons/types';
import { RichTextEditor, SelectField, TextField, TimePickerField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import { convertSecondsToHMS } from 'utils/timeConverter';
import NumberTextField from 'components/fields/Number';
import MediaUploadField from 'components/fields/VideoUploder';
import { useEasyFileUploader } from 'hooks/useFileUploader';
import normalizeImgUrl from 'utils/normalizeFileUrl';

const lessonSchema = z.object({
  name: z.string().min(3, 'Kamida 3 ta belgi kiriting'),
  description: z.string().min(20, 'Kamida 20 ta belgi kiriting'),
  shortDescription: z.string().min(3, 'Kamida 3 ta belgi kiriting'),
  link: z.union([z.string(), z.instanceof(File)]).optional(),
  photo: z.union([z.string(), z.instanceof(File)]).optional(),
  duration: z.number().optional(), // serverga _duration orqali hisoblab yuboramiz
  _duration: z.date().optional(),
  orderIndex: z.number().min(1, 'Tartib raqami 1 dan katta bo\'lishi kerak').optional(),
  videoId: z.string().optional().nullable(),
  linkType: z.nativeEnum(LessonLinkType), // keeping linkType for UI logic but it won't be in payload if not needed
});

type lessonFormSchema = z.infer<typeof lessonSchema>;

interface IProps {
  lesson?: Lesson;
  lastDataOrder?: number;
  setSheetOpen: (state: boolean) => void;
}

const initialDate = new Date();
initialDate.setHours(0, 0, 0);

const typeData = [
  { type: LessonLinkType.YOU_TUBE, name: 'YouTube link' },
  { type: LessonLinkType.VIDEO, name: 'Yuklanadigan dars(file)' },
];

export default function LessonForm({ lesson, lastDataOrder: lastLessonOrder, setSheetOpen }: IProps) {
  const { moduleId, courseId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ useEasyFileUploader ishlatamiz
  const { uploadFile: uploadVideo } = useEasyFileUploader('/file');
  const { uploadFile: uploadThumbnail } = useEasyFileUploader('/file');

  const { triggerLessonCreate, isPending: isLessonCreatePending } = useCreateLesson({ setSheetOpen });
  const { triggerLessonEdit, isPending: isLessonEditPending } = useEditLesson({ id: lesson?.id, setSheetOpen });

  const _duration = useMemo(() => {
    const value = new Date(initialDate);
    if (!lesson?.duration) return value;
    const { hours, minutes, seconds } = convertSecondsToHMS(lesson.duration);
    value.setHours(hours, minutes, seconds);
    return value;
  }, [lesson?.duration]);

  const form = useForm<lessonFormSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson
      ? {
        name: lesson.name,
        description: lesson.description,
        shortDescription: lesson.shortDescription || lesson.name,
        photo: lesson.photo ? normalizeImgUrl(lesson.photo) : undefined,
        linkType: LessonLinkType.YOU_TUBE, // Defaulting if not present in new model
        link: lesson.link,
        videoId: '',
        duration: lesson.duration,
        _duration,
        orderIndex: lesson.orderIndex ?? 0,
      }
      : {
        name: '',
        description: '',
        shortDescription: '',
        link: '',
        photo: undefined,
        videoId: '',
        duration: 0,
        linkType: LessonLinkType.YOU_TUBE,
        _duration: initialDate,
        orderIndex: lastLessonOrder ? lastLessonOrder + 1 : 1,
      },
  });

  const type = form.watch('linkType');

  useEffect(() => {
    if (!lesson) {
      if (type === LessonLinkType.VIDEO) {
        form.setValue('link', '' as any);
        form.setValue('videoId', '');
      } else {
        form.setValue('link', '');
        form.setValue('videoId', null);
      }
    }
  }, [type, form, lesson]);

  async function onSubmit(formValues: lessonFormSchema) {
    try {
      setIsLoading(true);

      const duration = Math.trunc(
        formValues._duration ? (formValues._duration.getTime() - initialDate.getTime()) / 1000 : 0
      );

      const payloadData: Record<string, unknown> = {
        name: formValues.name,
        description: formValues.description,
        shortDescription: formValues.shortDescription,
        duration,
        moduleId: moduleId as string,
      };

      if (!lesson) {
        payloadData.courseId = courseId as string;
      } else {
        payloadData.orderIndex = formValues.orderIndex;
      }

      // ✅ PHOTO
      if (formValues.photo instanceof File) {
        const photoPath = await uploadThumbnail(formValues.photo);
        payloadData.photo = photoPath || '';
      } else {
        payloadData.photo = (formValues.photo as string) || lesson?.photo || '';
      }

      // ✅ LINK
      if (formValues.linkType === LessonLinkType.YOU_TUBE) {
        payloadData.link =
          typeof formValues.link === 'string'
            ? formValues.link
            : formValues.link instanceof File
            ? lesson?.link || ''
            : lesson?.link || '';
      } else if (formValues.linkType === LessonLinkType.VIDEO) {
        if (formValues.link instanceof File) {
          const videoId = await uploadVideo(formValues.link);
          payloadData.link = videoId || formValues.videoId || '';
        } else {
          payloadData.link = formValues.videoId || lesson?.link || '';
        }
      }

      if (lesson) {
        await triggerLessonEdit(payloadData as unknown as Partial<LessonInput>);
      } else {
        await triggerLessonCreate(payloadData as unknown as LessonInput);
      }
    } catch (e) {
      console.error('❌ Xatolik yuz berdi:', e);
      // Bu yerda toast yoki error message ko'rsatish mumkin
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 my-4">
          <TextField name="name" label="Dars nomi" required />
          <TextField name="shortDescription" label="Dars qisqa tavsifi" required />

          <SelectField
            name="linkType"
            data={typeData}
            placeholder="Video turini tanlang..."
            label="Video turini tanlang"
          />

          <MediaUploadField
            name="photo"
            label="Rasm yuklash"
            types={['JPG', 'PNG', 'JPEG', 'WEBP']}
            defaultValue={lesson?.photo ? normalizeImgUrl(lesson.photo) : undefined}
            required
          />

          {type === LessonLinkType.VIDEO ? (
            <div className="flex justify-between gap-3 items-center">
              <MediaUploadField name="link" label="Dars videosi" />
              <TextField
                name="videoId"
                label="Video Id kiriting"
                placeholder="124bd1da-6fba-4633-bdf0-f6738af91f6c"
              />
            </div>
          ) : (
            <TextField name="link" label="YouTube havolasi" required />
          )}

          <div className="flex items-center justify-start gap-4">
            <TimePickerField name="_duration" label="Darsning davomiyligi" required />
            {lesson && <NumberTextField name="orderIndex" placeholder="Tartib raqami" label="Tartib raqami" />}
          </div>

          <RichTextEditor name="description" label="Dars tavsifi" required />
        </div>

        <LoadingButton isLoading={isLoading || isLessonCreatePending || isLessonEditPending}>
          {lesson ? 'Tahrirlash' : 'Saqlash'}
        </LoadingButton>
      </form>
    </Form>
  );
}