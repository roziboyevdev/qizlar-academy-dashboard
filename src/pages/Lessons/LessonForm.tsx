import { z } from "zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateLesson } from "modules/lessons/hooks/useCreateLesson";
import { useEditLesson } from "modules/lessons/hooks/useEditLesson";
import { Form } from "components/ui/form";
import { Lesson } from "modules/lessons/types";
import { RichTextEditor, TextField, TimePickerField } from "components/fields";
import LoadingButton from "components/LoadingButton";
import { convertSecondsToHMS } from "utils/timeConverter";
import CustomSwitch from "components/SwitchIsDreft";

const lessonSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  link: z.string().url(),
  duration: z.number().optional(),
  _duration: z.date().optional(),
  isSoon: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type lessonFormSchema = z.infer<typeof lessonSchema>;

interface IProps {
  lesson?: Lesson;
  lastDataOrder?: number;
  setSheetOpen: (state: boolean) => void;
}

const initialDate = new Date();
initialDate.setHours(0, 0, 0);

export default function LessonForm({
  lesson,
  lastDataOrder: lastLessonOrder,
  setSheetOpen,
}: IProps) {
  const { moduleId } = useParams();
  const initialState = lesson?.title ? lesson.isSoon ?? true : false;
  const [isSoon, setIsSoon] = useState<boolean>(initialState);
  const initialActive = lesson?.title ? lesson.isActive : true;
  const [isActive, setIsActive] = useState<boolean>(initialActive);


  const { triggerLessonCreate, isPending: isLessonCreatePending } = useCreateLesson({ setSheetOpen });
  const { triggerLessonEdit, isPending: isLessonEditPending } = useEditLesson({
    id: lesson?.id,
    setSheetOpen,
  });

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
          title: lesson.title,
          description: lesson.description,
          link: lesson.link,
          duration: lesson.duration,
          _duration,
          isSoon: lesson.isSoon,
          isActive: lesson.isActive,
        }
      : {
          title: "",
          description: "",
          link: "",
          duration: 0,
          _duration,
          isSoon: false,
          isActive: false,
        },
  });

  function onSubmit(formValues: lessonFormSchema) {
    const duration = Math.trunc(
      formValues._duration
        ? (formValues._duration.getTime() - new Date(initialDate).getTime()) /
            1000
        : 0
    ) 
    formValues.duration = duration ;
    delete formValues._duration;

    const payload = {
      ...formValues,
      moduleId: moduleId as string,
      isActive: isActive,
      isSoon: isSoon,
    };
    if (lesson) {
      triggerLessonEdit(payload);
    } else {
      triggerLessonCreate(payload);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Dars nomi" required />
          <TextField name="link" label="Havolasi" required />

          <div className="flex items-center justify-start">
            <TimePickerField
              name="_duration"
              label="Darsning davomiyligi"
              required
            />
          </div>

          <div className="flex items-center justify-start gap-8">

            <div>
              <h4 className="mb-1">Tayyor yoki tez kunda  </h4>
              <CustomSwitch
                state={isSoon}
                setState={setIsSoon}
                labelText={isSoon ? "Tez kunda" : "Tayyor"}
              />
            </div>
            <div>
              <h4 className="mb-1">Dars chiqarilishga tayyor yoki yo'q</h4>
              <CustomSwitch
                state={isActive}
                setState={setIsActive}
                labelText={
                  isActive ? "Ko'rinadigan dars" : "Ko'rinmaydigan Dars"
                }
              />
            </div>
          </div>

          <RichTextEditor name="description" label="Dars tavsifi" required />
        </div>
        {lesson ? (
          <LoadingButton isLoading={isLessonEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={isLessonCreatePending}>
            Saqlash
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
