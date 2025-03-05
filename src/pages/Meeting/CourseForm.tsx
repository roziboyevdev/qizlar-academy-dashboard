import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import {
  FileField,
  SelectField,
  TextAreaField,
  TextField,
} from "components/fields";
import LoadingButton from "components/LoadingButton";
import NumberTextField from "components/fields/Number";
import { useEditMeeting } from "modules/meeting/hooks/useEdit";
import { useCreateMeeting } from "modules/meeting/hooks/useCreate";
import { IMeeting, MeetingType } from "modules/meeting/types";

const typeData = [
  { type: MeetingType.ONLINE, name: "Online" },
  { type: MeetingType.OFFLINE, name: "Offline" },
];

const courseSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title eng kamida 6 ta harfdan iborat bo'lsin" }),
  description: z.string().min(20, {
    message: "description uchun kamida 20 ta harifdan iforat text kirgazing",
  }),
  banner: z.union([
    z.custom<File>((file) => file instanceof File, {
      message: "Rasm talab qilinadi",
    }),
    z.string(),
  ]),
  link: z.string({ message: "Link kiritlishi shart" }),
  type: z.nativeEnum(MeetingType),
});

type courseFormSchema = z.infer<typeof courseSchema>;

interface IProps {
  vacancy?: IMeeting;
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ vacancy, setSheetOpen }: IProps) {
  const { triggerVacancyCreate, isPending: isCourseCreatePending } =
    useCreateMeeting({ setSheetOpen });
  const { triggerMeetingEdit, isPending: isCourseEditPending } = useEditMeeting(
    {
      id: vacancy?.id,
      setSheetOpen,
    }
  );

  const form = useForm<courseFormSchema>({
    resolver: zodResolver(courseSchema),
    mode: "onSubmit",
    defaultValues: vacancy
      ? {
          title: vacancy.title,
          description: vacancy.description,
          banner: vacancy.banner,
          link: vacancy.link,
          type: vacancy.type,
        }
      : {
          title: "",
          description: "",
          banner: "",
          link: "",
          type: MeetingType.EMPTY,
        },
  });

  async function onSubmit(formValues: courseFormSchema) {
    // if (vacancy) {
    //   triggerMeetingEdit({
    //     ...formValues,
    //     fromExperience: +fromExperience,
    //     toExperience: +toExperience,
    //     salary: +salary,
    //   });
    // } else {
    //   triggerVacancyCreate({
    //     ...formValues,
    //     fromExperience: +fromExperience,
    //     toExperience: +toExperience,
    //     salary: +salary,
    //   });
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <TextField
            name="title"
            label="Vakansiya nomi"
            required
            placeholder="Frontendchi kerak"
          />

          <TextField
            name="link"
            label="Uchrashuv nomi"
            placeholder="Google"
            required
          />

          <FileField name="banner" label="Uchrashuv rasmi" />

       

          <SelectField
            name="type"
            data={typeData}
            placeholder="Vakansiya turi..."
            label="Vakansiya turi"
          />

          <NumberTextField
            name="salary"
            placeholder="Oylik maosh"
            label="Oylik maosh"
            required
          />

          <TextAreaField
            name="description"
            label="Vakansiya Tarifi "
            required
          />
        </div>
        {vacancy ? (
          <LoadingButton isLoading={isCourseEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={isCourseCreatePending}>
            Saqlash
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
