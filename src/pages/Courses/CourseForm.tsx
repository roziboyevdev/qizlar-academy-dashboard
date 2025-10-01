"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Course, CourseInput } from "modules/courses/types"
import useFileUploader from "hooks/useFileUploader"
import { useCreateCourse } from "modules/courses/hooks/useCreateCourse"
import { useEditCourse } from "modules/courses/hooks/useEditCourse"
import { Form } from "components/ui/form"
import { FileField, RichTextEditor, SelectField, TextAreaField, TextField } from "components/fields"
import LoadingButton from "components/LoadingButton"
import NumberTextField from "components/fields/Number"
import KeywordField from "components/fields/KeywordField"
import { useEffect, useState } from "react"
import type { SelectType } from "pages/Certificate/CustomForm"
import { useTeachersList } from "modules/teachers/hooks/useList"
import MediaUploadField from "components/fields/VideoUploder"

const typeData = [
  { type: "SUBJECT", name: "Fan" },
  { type: "PROFESSION", name: "Kasb" },
]
const levelData = [
  { type: "EASY", name: "Oson" },
  { type: "MEDIUM", name: "O'rtacha" },
  { type: "HARD", name: "Qiyin" },
]

const pricingTypeData = [
  { type: "FREE", name: "Bepul" },
  { type: "PAID", name: "Pullik" },
  { type: "TOURISM", name: "Turizm" },
]

const courseSchema = z.discriminatedUnion("pricingType", [
  // FREE course schema
  z.object({
    pricingType: z.literal("FREE"),
    slug: z.string().min(3),
    title: z.string().min(3),
    teacherId: z.string(),
    description: z.string().min(10),
    icon: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    banner: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    type: z.string().min(3),
    degree: z.string().min(3),
    planLessonCount: z.number(),
    seoTitle: z.string().min(50, { message: "title kamida 50 ta harifdan iborat text kirgazing" }).max(65, {
      message: "title  maximal 65 ta harifdan iborat text kirgazing",
    }),
    seoDescription: z
      .string()
      .min(120, {
        message: "description uchun kamida 120 ta harifdan iforat text kirgazing",
      })
      .max(320, {
        message: "description maximal 320 ta harifdan iforat text kirgazing",
      }),
    seoKeywords: z.union([z.array(z.string()).min(3, { message: "Kamida 3 kalit so'z kiriting" }), z.string()]),
  }),
  // PAID course schema
  z.object({
    pricingType: z.literal("PAID"),
    slug: z.string().min(3),
    title: z.string().min(3),
    teacherId: z.string(),
    description: z.string().min(10),
    icon: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    banner: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    price: z.number().min(0, { message: "Narx 0 dan katta bo'lishi kerak" }),
    type: z.string().min(3),
    degree: z.string().min(3),
    planLessonCount: z.number(),
    seoTitle: z.string().min(50, { message: "title kamida 50 ta harifdan iborat text kirgazing" }).max(65, {
      message: "title  maximal 65 ta harifdan iborat text kirgazing",
    }),
    seoDescription: z
      .string()
      .min(120, {
        message: "description uchun kamida 120 ta harifdan iforat text kirgazing",
      })
      .max(320, {
        message: "description maximal 320 ta harifdan iforat text kirgazing",
      }),
    seoKeywords: z.union([z.array(z.string()).min(3, { message: "Kamida 3 kalit so'z kiriting" }), z.string()]),
  }),
  // TOURISM course schema
  z.object({
    pricingType: z.literal("TOURISM"),
    slug: z.string().min(3),
    title: z.string().min(3),
    teacherId: z.string(),
    description: z.string().min(10),
    icon: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    banner: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(1, { message: "Rasm talab qilinadi" }),
    ]),
    audioLink: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Audio fayl talab qilinadi",
      }),
      z.string().min(1, { message: "Audio fayl talab qilinadi" }),
    ]),
    type: z.string().min(3),
    degree: z.string().min(3),
    planLessonCount: z.number(),
    seoTitle: z.string().min(50, { message: "title kamida 50 ta harifdan iborat text kirgazing" }).max(65, {
      message: "title  maximal 65 ta harifdan iborat text kirgazing",
    }),
    seoDescription: z
      .string()
      .min(120, {
        message: "description uchun kamida 120 ta harifdan iforat text kirgazing",
      })
      .max(320, {
        message: "description maximal 320 ta harifdan iforat text kirgazing",
      }),
    seoKeywords: z.union([z.array(z.string()).min(3, { message: "Kamida 3 kalit so'z kiriting" }), z.string()]),
  }),
])

type courseFormSchema = z.infer<typeof courseSchema>

interface IProps {
  course?: Course
  setSheetOpen: (state: boolean) => void
}

export default function CourseForm({ course, setSheetOpen }: IProps) {
  const [teachersData, setTeachersData] = useState<SelectType[]>([])

  const { uploadFile, isPending: isFileUpload } = useFileUploader()
  const { triggerCourseCreate, isPending: isCourseCreatePending } = useCreateCourse({ setSheetOpen })
  const { triggerCourseEdit, isPending: isCourseEditPending } = useEditCourse({
    id: course?.id,
    setSheetOpen,
  })

  const { data: coursesList } = useTeachersList(1, 50)

  const form = useForm<courseFormSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          slug: course.slug,
          icon: course.icon,
          teacherId: course.teacherId,
          banner: course.banner,
          seoTitle: course?.seo?.title,
          seoDescription: course?.seo?.description,
          seoKeywords: Array.isArray(course?.seo?.keywords)
            ? course?.seo?.keywords
            : course?.seo?.keywords?.split(",") || [],
          pricingType: course.pricingType || "FREE",
          ...(course.pricingType === "PAID"
            ? {
                price: course.price || 0,
                type: course.type,
                degree: course.degree,
                planLessonCount: course?.planLessonCount,
              }
            : course.pricingType === "TOURISM"
              ? {
                  audioLink: course.audioLink || "",
                  type: course.type,
                  degree: course.degree,
                  planLessonCount: course?.planLessonCount,
                }
              : {
                  type: course.type,
                  degree: course.degree,
                  planLessonCount: course?.planLessonCount,
                }),
        }
      : {
          title: "",
          description: "",
          icon: "",
          slug: "",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: [],
          pricingType: "FREE",
          type: "",
          degree: "",
          planLessonCount: 0,
        },
  })

  const pricingType = form.watch("pricingType")

  async function onSubmit(formValues: courseFormSchema) {
    const value = await uploadFile<CourseInput>(formValues, "icon")
    const withBanner = await uploadFile<CourseInput>(value, "banner")

    let finalPayload: any

    if (formValues.pricingType === "PAID") {
      // PAID course payload with price
      finalPayload = {
        title: withBanner.title,
        description: withBanner.description,
        seoTitle: withBanner.seoTitle,
        seoDescription: withBanner.seoDescription,
        seoKeywords: formValues.seoKeywords?.toString(),
        banner: withBanner.banner,
        icon: withBanner.icon,
        pricingType: withBanner.pricingType,
        slug: withBanner.slug,
        price: withBanner.price,
        teacherId: withBanner.teacherId,
        type: withBanner.type,
        degree: withBanner.degree,
        planLessonCount: withBanner.planLessonCount,
      }
    } else if (formValues.pricingType === "TOURISM") {
      // TOURISM course payload with audioLink
      const withAudio = await uploadFile<CourseInput>(withBanner, "audioLink")

      finalPayload = {
        title: withAudio.title,
        description: withAudio.description,
        seoTitle: withAudio.seoTitle,
        seoDescription: withAudio.seoDescription,
        seoKeywords: formValues.seoKeywords?.toString(),
        banner: withAudio.banner,
        icon: withAudio.icon,
        pricingType: withAudio.pricingType,
        slug: withAudio.slug,
        teacherId: withAudio.teacherId,
        audioLink: withAudio.audioLink,
        type: withAudio.type,
        degree: withAudio.degree,
        planLessonCount: withAudio.planLessonCount,
      }
    } else {
      // FREE course payload
      finalPayload = {
        title: withBanner.title,
        description: withBanner.description,
        seoTitle: withBanner.seoTitle,
        seoDescription: withBanner.seoDescription,
        seoKeywords: formValues.seoKeywords?.toString(),
        banner: withBanner.banner,
        icon: withBanner.icon,
        slug: withBanner.slug,
        planLessonCount: withBanner.planLessonCount,
        pricingType: withBanner.pricingType,
        type: withBanner.type,
        degree: withBanner.degree,
        teacherId: withBanner.teacherId,
      }
    }

    if (course) {
      triggerCourseEdit(finalPayload)
    } else {
      triggerCourseCreate(finalPayload)
    }
  }

  useEffect(() => {
    const newArr: SelectType[] = []
    coursesList.forEach((el) =>
      newArr.push({
        name: el.fullname,
        type: el.id,
      }),
    )
    setTeachersData(newArr)
  }, [coursesList])

  console.log(form.formState.errors)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Kurs nomi" required />
          <TextField name="slug" label="Slug" placeholder="no-code-kursi" required />

          <SelectField
            name="pricingType"
            data={pricingTypeData}
            placeholder="Kurs turini tanlang..."
            label="Narxlash turi"
          />

          {pricingType === "FREE" && (
            <>
              <SelectField name="type" data={typeData} placeholder="Kurs turini tanlang..." label="Kurs turi" />
              <SelectField
                name="degree"
                data={levelData}
                placeholder="Kurs darajasini tanlang..."
                label="Kurs darajasi"
              />
              <NumberTextField
                name="planLessonCount"
                placeholder="Rejalashtirilgan darslar soni"
                label="Rejalashtirilgan darslar soni"
                required
              />
            </>
          )}

          {pricingType === "PAID" && (
            <>
              <NumberTextField name="price" placeholder="Kurs narxi" label="Kurs narxi (so'm)" required />
              <SelectField name="type" data={typeData} placeholder="Kurs turini tanlang..." label="Kurs turi" />
              <SelectField
                name="degree"
                data={levelData}
                placeholder="Kurs darajasini tanlang..."
                label="Kurs darajasi"
              />
              <NumberTextField
                name="planLessonCount"
                placeholder="Rejalashtirilgan darslar soni"
                label="Rejalashtirilgan darslar soni"
                required
              />
            </>
          )}

          {pricingType === "TOURISM" && (
            <>
              <MediaUploadField
                name="audioLink"
                label="Audio fayl"
                types={["MP3", "WAV", "M4A", "AAC", "OGG", "FLAC"]}
                required
              />
              <SelectField name="type" data={typeData} placeholder="Kurs turini tanlang..." label="Kurs turi" />
              <SelectField
                name="degree"
                data={levelData}
                placeholder="Kurs darajasini tanlang..."
                label="Kurs darajasi"
              />
              <NumberTextField
                name="planLessonCount"
                placeholder="Rejalashtirilgan darslar soni"
                label="Rejalashtirilgan darslar soni"
                required
              />
            </>
          )}

          <SelectField
            name="teacherId"
            data={teachersData}
            placeholder="Kurs Ustozini tanlang..."
            label="Kurs Ustozi"
          />
          <RichTextEditor name="description" label="Dars tavsifi" required />
          <FileField name="icon" label="Icon rasmi" required />
          <FileField name="banner" label="Banner rasmi" required />
          <hr />
          <TextField
            name="seoTitle"
            label="Seo title - (50 - 65)"
            placeholder="Bepul Targeting Kursi - Ustoz Aida Bilan O'rganing | Tezroq Boshlang"
            required
          />
          <TextAreaField
            name="seoDescription"
            label="Seo description (120 - 320)"
            placeholder="Targeting kursini ustoz aida o'rganing . Kursimiz davomida  Reklama strategiyalarini tuzish, mijozlarni aniq aniqlash, va onlayn savdoni oshirishni o'rganib, o'z biznesingiz yoki brendingiz uchun muvaffaqiyatli targeting yaratishga erishing. Bepul darslar bilan boshlang!"
            required
          />
          <KeywordField
            name="seoKeywords"
            label="Seo seoKeywords"
            placeholder="Target reklama, pul ishlash, targeting kurslar, bepul kurslar"
            required
          />
        </div>
        {course ? (
          <LoadingButton isLoading={isFileUpload || isCourseEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isFileUpload || isCourseCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  )
}


// 'use client';

// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import type { Course, CourseInput } from 'modules/courses/types';
// import useFileUploader from 'hooks/useFileUploader';
// import { useCreateCourse } from 'modules/courses/hooks/useCreateCourse';
// import { useEditCourse } from 'modules/courses/hooks/useEditCourse';
// import { Form } from 'components/ui/form';
// import { FileField, RichTextEditor, SelectField, TextAreaField, TextField } from 'components/fields';
// import LoadingButton from 'components/LoadingButton';
// import NumberTextField from 'components/fields/Number';
// import KeywordField from 'components/fields/KeywordField';
// import { useEffect, useState } from 'react';
// import type { SelectType } from 'pages/Certificate/CustomForm';
// import { useTeachersList } from 'modules/teachers/hooks/useList';
// import MediaUploadField from 'components/fields/VideoUploder';

// const typeData = [
//   { type: 'SUBJECT', name: 'Fan' },
//   { type: 'PROFESSION', name: 'Kasb' },
// ];
// const levelData = [
//   { type: 'EASY', name: 'Oson' },
//   { type: 'MEDIUM', name: "O'rtacha" },
//   { type: 'HARD', name: 'Qiyin' },
// ];

// const pricingTypeData = [
//   { type: 'FREE', name: 'Bepul' },
//   { type: 'PAID', name: 'Pullik' },
// ];

// const courseSchema = z.discriminatedUnion('pricingType', [
//   // FREE course schema
//   z.object({
//     pricingType: z.literal('FREE'),
//     slug: z.string().min(3),
//     title: z.string().min(3),
//     teacherId: z.string(),
//     description: z.string().min(10),
//     icon: z.union([
//       z.custom<File>((file) => file instanceof File, {
//         message: 'Rasm talab qilinadi',
//       }),
//       z.string().min(1, { message: 'Rasm talab qilinadi' }),
//     ]),
//     banner: z.union([
//       z.custom<File>((file) => file instanceof File, {
//         message: 'Rasm talab qilinadi',
//       }),
//       z.string().min(1, { message: 'Rasm talab qilinadi' }),
//     ]),
//     type: z.string().min(3),
//     degree: z.string().min(3),
//     planLessonCount: z.number(),
//     seoTitle: z.string().min(50, { message: 'title kamida 50 ta harifdan iborat text kirgazing' }).max(65, {
//       message: 'title  maximal 65 ta harifdan iborat text kirgazing',
//     }),
//     seoDescription: z
//       .string()
//       .min(120, {
//         message: 'description uchun kamida 120 ta harifdan iforat text kirgazing',
//       })
//       .max(320, {
//         message: 'description maximal 320 ta harifdan iforat text kirgazing',
//       }),
//     seoKeywords: z.union([z.array(z.string()).min(3, { message: "Kamida 3 kalit so'z kiriting" }), z.string()]),
//   }),
//   // PAID course schema
//   z.object({
//     pricingType: z.literal('PAID'),
//     slug: z.string().min(3),
//     title: z.string().min(3),
//     teacherId: z.string(),
//     description: z.string().min(10),
//     icon: z.union([
//       z.custom<File>((file) => file instanceof File, {
//         message: 'Rasm talab qilinadi',
//       }),
//       z.string().min(1, { message: 'Rasm talab qilinadi' }),
//     ]),
//     banner: z.union([
//       z.custom<File>((file) => file instanceof File, {
//         message: 'Rasm talab qilinadi',
//       }),
//       z.string().min(1, { message: 'Rasm talab qilinadi' }),
//     ]),
//     price: z.number().min(0, { message: "Narx 0 dan katta bo'lishi kerak" }),
//     audioLink: z.union([
//       z.custom<File>((file) => file instanceof File, {
//         message: 'Audio fayl talab qilinadi',
//       }),
//       z.string().min(1, { message: 'Audio fayl talab qilinadi' }),
//     ]),
//     seoTitle: z.string().min(50, { message: 'title kamida 50 ta harifdan iborat text kirgazing' }).max(65, {
//       message: 'title  maximal 65 ta harifdan iborat text kirgazing',
//     }),
//     seoDescription: z
//       .string()
//       .min(120, {
//         message: 'description uchun kamida 120 ta harifdan iforat text kirgazing',
//       })
//       .max(320, {
//         message: 'description maximal 320 ta harifdan iforat text kirgazing',
//       }),
//     seoKeywords: z.union([z.array(z.string()).min(3, { message: "Kamida 3 kalit so'z kiriting" }), z.string()]),
//   }),
// ]);

// type courseFormSchema = z.infer<typeof courseSchema>;

// interface IProps {
//   course?: Course;
//   setSheetOpen: (state: boolean) => void;
// }

// export default function CourseForm({ course, setSheetOpen }: IProps) {
//   const [teachersData, setTeachersData] = useState<SelectType[]>([]);

//   const { uploadFile, isPending: isFileUpload } = useFileUploader();
//   const { triggerCourseCreate, isPending: isCourseCreatePending } = useCreateCourse({ setSheetOpen });
//   const { triggerCourseEdit, isPending: isCourseEditPending } = useEditCourse({
//     id: course?.id,
//     setSheetOpen,
//   });

//   const { data: coursesList } = useTeachersList(1, 50);

//   const form = useForm<courseFormSchema>({
//     resolver: zodResolver(courseSchema),
//     defaultValues: course
//       ? {
//           title: course.title,
//           description: course.description,
//           slug: course.slug,
//           icon: course.icon,
//           teacherId: course.teacherId,
//           banner: course.banner,
//           seoTitle: course?.seo?.title,
//           seoDescription: course?.seo?.description,
//           seoKeywords: Array.isArray(course?.seo?.keywords) ? course?.seo?.keywords : course?.seo?.keywords?.split(',') || [],
//           pricingType: course.pricingType || 'FREE',
//           ...(course.pricingType === 'PAID'
//             ? {
//                 price: course.price || 0,
//                 audioLink: course.audioLink || '',
//               }
//             : {
//                 type: course.type,
//                 degree: course.degree,
//                 planLessonCount: course?.planLessonCount,
//               }),
//         }
//       : {
//           title: '',
//           description: '',
//           icon: '',
//           slug: '',
//           seoTitle: '',
//           seoDescription: '',
//           seoKeywords: [],
//           pricingType: 'FREE',
//           type: '',
//           degree: '',
//           planLessonCount: 0,
//         },
//   });

//   const pricingType = form.watch('pricingType');

//   async function onSubmit(formValues: courseFormSchema) {
//     const value = await uploadFile<CourseInput>(formValues, 'icon');
//     const withBanner = await uploadFile<CourseInput>(value, 'banner');

//     let finalPayload: any;

//     if (formValues.pricingType === 'PAID') {
//       // Upload audio file for PAID courses
//       const withAudio = await uploadFile<CourseInput>(withBanner, 'audioLink');

//       finalPayload = {
//         title: withAudio.title,
//         description: withAudio.description,
//         seoTitle: withAudio.seoTitle,
//         seoDescription: withAudio.seoDescription,
//         seoKeywords: formValues.seoKeywords?.toString(),
//         banner: withAudio.banner,
//         icon: withAudio.icon,
//         pricingType: withAudio.pricingType,
//         slug: withAudio.slug,
//         price: withAudio.price,
//         teacherId: withAudio.teacherId,
//         audioLink: withAudio.audioLink,
//       };
//     } else {
//       // FREE course payload
//       finalPayload = {
//         title: withBanner.title,
//         description: withBanner.description,
//         seoTitle: withBanner.seoTitle,
//         seoDescription: withBanner.seoDescription,
//         seoKeywords: formValues.seoKeywords?.toString(),
//         banner: withBanner.banner,
//         icon: withBanner.icon,
//         slug: withBanner.slug,
//         planLessonCount: withBanner.planLessonCount,
//         pricingType: withBanner.pricingType,
//         type: withBanner.type,
//         degree: withBanner.degree,
//         teacherId: withBanner.teacherId,
//       };
//     }

//     if (course) {
//       triggerCourseEdit(finalPayload);
//     } else {
//       triggerCourseCreate(finalPayload);
//     }
//   }

//   useEffect(() => {
//     const newArr: SelectType[] = [];
//     coursesList.forEach((el) =>
//       newArr.push({
//         name: el.fullname,
//         type: el.id,
//       })
//     );
//     setTeachersData(newArr);
//   }, [coursesList]);

//   console.log(form.formState.errors);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
//         <div className="flex gap-4 flex-col my-4">
//           <TextField name="title" label="Kurs nomi" required />
//           <TextField name="slug" label="Slug" placeholder="no-code-kursi" required />

//           <SelectField name="pricingType" data={pricingTypeData} placeholder="Kurs turini tanlang..." label="Narxlash turi" />

//           {pricingType === 'FREE' && (
//             <>
//               <SelectField name="type" data={typeData} placeholder="Kurs turini tanlang..." label="Kurs turi" />
//               <SelectField name="degree" data={levelData} placeholder="Kurs darajasini tanlang..." label="Kurs darajasi" />
//               <NumberTextField
//                 name="planLessonCount"
//                 placeholder="Rejalashtirilgan darslar soni"
//                 label="Rejalashtirilgan darslar soni"
//                 required
//               />
//             </>
//           )}

//           {pricingType === 'PAID' && (
//             <>
//               <NumberTextField name="price" placeholder="Kurs narxi" label="Kurs narxi (so'm)" required />
//               <MediaUploadField name="audioLink" label="Audio fayl" types={['MP3', 'WAV', 'M4A', 'AAC', 'OGG', 'FLAC']} required />
//             </>
//           )}

//           <SelectField name="teacherId" data={teachersData} placeholder="Kurs Ustozini tanlang..." label="Kurs Ustozi" />
//           <RichTextEditor name="description" label="Dars tavsifi" required />
//           <FileField name="icon" label="Icon rasmi" required />
//           <FileField name="banner" label="Banner rasmi" required />
//           <hr />
//           <TextField
//             name="seoTitle"
//             label="Seo title - (50 - 65)"
//             placeholder="Bepul Targeting Kursi - Ustoz Aida Bilan O'rganing | Tezroq Boshlang"
//             required
//           />
//           <TextAreaField
//             name="seoDescription"
//             label="Seo description (120 - 320)"
//             placeholder="Targeting kursini ustoz aida o'rganing . Kursimiz davomida  Reklama strategiyalarini tuzish, mijozlarni aniq aniqlash, va onlayn savdoni oshirishni o'rganib, o'z biznesingiz yoki brendingiz uchun muvaffaqiyatli targeting yaratishga erishing. Bepul darslar bilan boshlang!"
//             required
//           />
//           <KeywordField
//             name="seoKeywords"
//             label="Seo seoKeywords"
//             placeholder="Target reklama, pul ishlash, targeting kurslar, bepul kurslar"
//             required
//           />
//         </div>
//         {course ? (
//           <LoadingButton isLoading={isFileUpload || isCourseEditPending}>Tahrirlash</LoadingButton>
//         ) : (
//           <LoadingButton isLoading={isFileUpload || isCourseCreatePending}>Saqlash</LoadingButton>
//         )}
//       </form>
//     </Form>
//   );
// }
