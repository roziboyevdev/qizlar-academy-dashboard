'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Course, CourseInput } from 'modules/courses/types';
import useFileUploader from 'hooks/useFileUploader';
import { useCreateCourse } from 'modules/courses/hooks/useCreateCourse';
import { useEditCourse } from 'modules/courses/hooks/useEditCourse';
import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, SelectField, TextAreaField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import { useEffect, useMemo, useState } from 'react';
import type { SelectType } from 'types/selectField';
import { useTeachersList } from 'modules/teachers/hooks/useList';
import CustomSwitch from 'components/SwitchIsDreft';

const courseSchema = z.object({
  name: z.string().min(3, { message: 'Kurs nomi kamida 3 ta belgidan iborat bo‘lsin' }),
  shortDescription: z.string().min(3, { message: 'Qisqa izohni kiriting' }),
  description: z.string().min(10, { message: 'Tavsif kamida 10 ta belgidan iborat bo‘lsin' }),
  teacherId: z.string().min(1, { message: 'Ustozni tanlang' }),
  icon: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Icon rasmi talab qilinadi' }),
    z.string().min(1, { message: 'Icon rasmi talab qilinadi' }),
  ]),
  bannerImage: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Banner rasmi talab qilinadi' }),
    z.string().min(1, { message: 'Banner rasmi talab qilinadi' }),
  ]),
});

type CourseFormSchema = z.infer<typeof courseSchema>;

interface IProps {
  course?: Course;
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ course, setSheetOpen }: IProps) {
  const [teachersData, setTeachersData] = useState<SelectType[]>([]);
  const initialActive = course?.id ? course.isActive ?? false : false;
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const { uploadFile, isPending: isFileUpload } = useFileUploader();
  const { triggerCourseCreate, isPending: isCourseCreatePending } = useCreateCourse({ setSheetOpen });
  const { triggerCourseEdit, isPending: isCourseEditPending } = useEditCourse({
    setSheetOpen,
  });

  const { data: coursesList } = useTeachersList(1, 50);

  const form = useForm<CourseFormSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          name: course.name ?? course.title ?? '',
          shortDescription: course.shortDescription ?? '',
          description: course.description ?? '',
          icon: course.icon,
          teacherId: course.teacherId,
          bannerImage: course.bannerImage ?? course.banner ?? '',
        }
      : {
          name: '',
          shortDescription: '',
          description: '',
          teacherId: '',
          icon: '',
          bannerImage: '',
        },
  });

  const teacherOptions = useMemo(() => teachersData, [teachersData]);

  async function onSubmit(formValues: CourseFormSchema) {
    try {
      const withIcon = await uploadFile<CourseInput>(formValues, 'icon');
      const withBanner = await uploadFile<CourseInput>(withIcon, 'bannerImage');

      const finalPayload: CourseInput = {
        name: withBanner.name,
        description: withBanner.description,
        shortDescription: withBanner.shortDescription,
        bannerImage: withBanner.bannerImage,
        icon: withBanner.icon,
        teacherId: withBanner.teacherId,
        isActive,
      };

      if (course?.id) {
        triggerCourseEdit({ id: course.id, values: finalPayload });
      } else {
        triggerCourseCreate(finalPayload);
      }
    } catch (err) {
      console.error('❌ onSubmit error:', err);
    }
  }

  useEffect(() => {
    const newArr: SelectType[] = [];
    coursesList.forEach((el) =>
      newArr.push({
        name: el.fullname,
        type: el.id,
      })
    );
    setTeachersData(newArr);
  }, [coursesList]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="name" label="Kurs nomi" required />
          <CustomSwitch
            state={isActive}
            setState={setIsActive}
            labelText={isActive ? "Faol (ko'rinadigan)" : "Faol emas (ko'rinmaydigan)"}
          />

          <SelectField name="teacherId" data={teacherOptions} placeholder="Kurs ustozini tanlang..." label="Kurs ustozi" />
          <TextAreaField name="shortDescription" label="Qisqa izoh" required />
          <RichTextEditor name="description" label="To'liq tavsif" required />
          <FileField name="icon" label="Icon rasmi" required />
          <FileField name="bannerImage" label="Banner rasmi" required />
        </div>
        {course ? (
          <LoadingButton isLoading={isFileUpload || isCourseEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isFileUpload || isCourseCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
