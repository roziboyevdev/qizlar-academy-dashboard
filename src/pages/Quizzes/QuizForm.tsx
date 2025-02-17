import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormDescription, FormMessage } from "components/ui/form";
import { Quiz, QuizContentType, QuizType } from "modules/quizzes/types";
import { TextAreaField, SelectField, FileField } from "components/fields";
import LoadingButton from "components/LoadingButton";
import { quizContentType, quizSelectType } from "constants/index";
import QuizOptions from "./QuizOptions";
import { useParams } from "react-router-dom";
import { useCreateQuiz } from "modules/quizzes/hooks/useCreateQuiz";
import { useEditQuiz } from "modules/quizzes/hooks/useEditQuiz";
import { fileType } from "pages/Product/schema";
import useFileUploader, { useEasyFileUploader } from "hooks/useFileUploader";
import { useFileUpload } from "modules/file-upload/hooks/useFileUpload";
import normalizeImgUrl from "utils/normalizeFileUrl";
import { useState } from "react";

const quizSchema = z.object({
  type: z.nativeEnum(QuizType, { required_error: "Savol tipini tanlang" }),
  content_type: z
    .nativeEnum(QuizContentType, { required_error: "Savol tipini tanlang" })
    .optional(),
  question: z.array(
    z.object({
      type: z.nativeEnum(QuizContentType),
      content: z.string().min(1, { message: "Savolni kiriting" }),
    })
  ),
  options: z
    .array(
      z.object({
        value: z.array(
          z.object({
            type: z.nativeEnum(QuizContentType),
            content: fileType.optional(),
          })
        ),
        is_correct: z.boolean(),
      })
    )
    .refine((data) => data.some((option) => option.is_correct), {
      message: "To'g'ri javobni belgilang",
      path: ["options"],
    }),
  photo: fileType.optional(),
});

export type quizFormSchema = z.infer<typeof quizSchema>;

interface IProps {
  quiz?: Quiz;
  setSheetOpen: (state: boolean) => void;
}

interface QuizWhichOhoto extends Quiz {
  photo: string;
}

function replaceH4WithEmptyString(data:Quiz) {
  const removeH4Tags = (content:string) => {
    return content.replace(/<h4>|<\/h4>/g, '');
  };

  // Replace in question
  // if (data.question) {
  //   data.question = data.question.map((q) => {
  //     if (q.content) {
  //       q.content = removeH4Tags(q.content);
  //     }
  //     return q;
  //   });
  // }

  // Replace in options
  // if (data.options) {
  //   data.options = data.options.map((option) => {
  //     if (option.value) {
  //       option.value = option.value.map((val) => {
  //         if (val.content) {
  //           val.content = removeH4Tags(val.content);
  //         }
  //         return val;
  //       });
  //     }
  //     return option;
  //   });
  // }

  return data;
}




const wrapImgTag = (url: string) =>
  `<img src=${normalizeImgUrl(url)} alt="quesion  img" />`;
const wrapH4Tag = (content: any) => `<h4>${content} </h4>`;

export default function QuizForm({ quiz, setSheetOpen }: IProps) {
  const { lessonId } = useParams();
 const [loading ,setLoading]= useState(false)
  const { triggerQuizCreate} = useCreateQuiz({
    setSheetOpen,
  });
  const { triggerQuizEdit, isPending: isQuizEditPending } = useEditQuiz({
    id: quiz?.id,
    setSheetOpen,
  });

  const { uploadFile } = useFileUploader();
  const { uploadFile: easyUpload } = useEasyFileUploader();
  const { triggerFileUpload, isPending } = useFileUpload();
  const newData = quiz ? replaceH4WithEmptyString(quiz):null
  const form = useForm<quizFormSchema>({
    resolver: zodResolver(quizSchema),
    // defaultValues: newData
    //   ? {
    //       type: newData.type,
    //       question: newData.question,
    //       options: newData.options,
    //       photo: newData.question[0].content,
    //       content_type:newData.question[0]?.type ==QuizContentType.PHOTO ? QuizContentType.PHOTO:QuizContentType.TEXT
    //     }
    //   : {
    //       type: QuizType.SINGLE_SELECT,
    //       question: [{ type: QuizContentType.TEXT, content: "savol" }],
    //       content_type:QuizContentType.TEXT,
    //       options: [
    //         {
    //           value: [{ type: QuizContentType.TEXT, content: "" }],
    //           is_correct: false,
    //         },
    //         {
    //           value: [{ type: QuizContentType.TEXT, content: "" }],
    //           is_correct: false,
    //         },
    //         {
    //           value: [{ type: QuizContentType.TEXT, content: "" }],
    //           is_correct: false,
    //         },
    //         {
    //           value: [{ type: QuizContentType.TEXT, content: "" }],
    //           is_correct: false,
    //         },
    //       ],
    //     },
  });
  const {
    control,
    formState: { errors },
    getValues,
  } = form;
  const { fields: questionFields } = useFieldArray({
    name: "question",
    control,
  });
  const quizType = getValues("type");
  const contentType = getValues("content_type");

  async function onSubmit(formValues: quizFormSchema) {
    setLoading(true)

    const data = { ...formValues, lesson: lessonId! };

    if (contentType == QuizContentType.PHOTO  && !quiz) {
      const values = await uploadFile<QuizWhichOhoto>(formValues, "photo");
      if (values?.photo) {
        data.question = [
          { type: QuizContentType.PHOTO, content: wrapImgTag( values.photo) },
        ];
      }
      const questionImg1: string = await easyUpload(formValues.options?.[0]?.value?.[0]?.content);
      const questionImg2: string = await easyUpload(formValues.options?.[1]?.value?.[0]?.content);
      const questionImg3: string = await easyUpload(formValues.options?.[2]?.value?.[0]?.content);
      const questionImg4: string = await easyUpload(formValues.options?.[3]?.value?.[0]?.content);

      data.options = [
        {value:[{ type: QuizContentType.PHOTO, content: wrapImgTag(questionImg1) }],is_correct:formValues.options?.[0]?.is_correct},
        {value:[{ type: QuizContentType.PHOTO, content: wrapImgTag(questionImg2) }],is_correct:formValues.options?.[1]?.is_correct},
        {value:[{ type: QuizContentType.PHOTO, content: wrapImgTag(questionImg3) }],is_correct:formValues.options?.[2]?.is_correct},
        {value:[{ type: QuizContentType.PHOTO, content: wrapImgTag(questionImg4) }],is_correct:formValues.options?.[3]?.is_correct},
      ];
    }else{
      data.question = [
        { type: QuizContentType.TEXT, content: wrapH4Tag(formValues.question?.[0]?.content) },
      ];
      data.options = [
        {value:[{ type: QuizContentType.TEXT, content: wrapH4Tag(formValues.options?.[0]?.value?.[0]?.content) }],is_correct:formValues.options?.[0]?.is_correct},
        {value:[{ type: QuizContentType.TEXT, content: wrapH4Tag(formValues.options?.[1]?.value?.[0]?.content) }],is_correct:formValues.options?.[1]?.is_correct},
        {value:[{ type: QuizContentType.TEXT, content: wrapH4Tag(formValues.options?.[2]?.value?.[0]?.content) }],is_correct:formValues.options?.[2]?.is_correct},
        {value:[{ type: QuizContentType.TEXT, content: wrapH4Tag(formValues.options?.[3]?.value?.[0]?.content) }],is_correct:formValues.options?.[3]?.is_correct},
      ];
    }
    delete data?.photo;
    delete data?.content_type
    const payload = {
      question: data.question[0].content, 
      options: data.options.map((option) => ({
        value: option.value[0]?.content, 
        isCorrect: option.is_correct, 
      })),
      lessonId: lessonId!, 
    };
    console.log(payload ,"payload");
    
    if (quiz) {
      triggerQuizEdit(payload);
    } else {
      triggerQuizCreate(payload);
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          {/* <div dangerouslySetInnerHTML={{ __html: result }} /> */}

          <SelectField
            name="type"
            data={quizSelectType}
            label="Savol turini tanlang"
            required
          />

          <SelectField
            name="content_type"
            data={quizContentType}
            label="Qanday savol kiritmoqchisiz "
            required
          />

          {!Boolean(contentType == QuizContentType.PHOTO) &&
            questionFields.map((field, index) => (
              <TextAreaField
                key={field.id}
                name={`question.${index}.content`}
                label="Savol"
                required
              />
            ))}

          {Boolean(contentType == QuizContentType.PHOTO) && (
            <FileField
              name={`photo`}
              label={`Savol rasmi kasrli savolar uchun (boshqa holda kiritish shartmas) `}
            />
          )}

          {/* <MathQuill formula={formula} setFormula={setFormula} /> */}
          <FormDescription className="mb-2 text-xs">
            {quizType === "single_select"
              ? "Bitta to'g'ri javobni belgilang"
              : "Bir va undan ortiq to'g'ri javobni belgilang"}
          </FormDescription>
          <QuizOptions
            isPhoto={Boolean(contentType == QuizContentType.PHOTO)}
          />

          {errors.options && (
            // @ts-ignore
            <FormMessage>{errors.options?.options?.message}</FormMessage>
          )}
        </div>
        {quiz ? (
          <LoadingButton isLoading={isQuizEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={loading}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
