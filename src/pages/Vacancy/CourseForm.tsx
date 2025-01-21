import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import { SelectField, TextAreaField, TextField } from "components/fields";
import LoadingButton from "components/LoadingButton";
import NumberTextField from "components/fields/Number";
import KeywordField from "components/fields/KeywordField";
import { Vacancy, VacancyType } from "modules/vacancy/types";
import { useCreateVacancy } from "modules/vacancy/hooks/useCreateCourse";
import { useEditVacancy } from "modules/vacancy/hooks/useEditCourse";
import DoubleNumberField from "components/fields/DoubleInput";


const typeData = [
  { type: VacancyType.FULL_TIME, name: "To'liq vaqt" },
  { type: VacancyType.ONE_TIME, name: "Bir martalik" },
  { type: VacancyType.INTERN, name: "Amalyot" },
];

const courseSchema = z.object({
  title: z
    .string()
    .min(6, { message: "Title eng kamida 6 ta harfdan iborat bo'lsin" }),
  description: z.string().min(20, {
    message: "description uchun kamida 20 ta harifdan iforat text kirgazing",
  }),
  company: z.string({ message: "Companiya nomi kiritlishi shart" }),
  salary: z.union([z.number(), z.string()]),
  type: z.nativeEnum(VacancyType),
  from_experience: z.union([z.number(), z.string()]),
  to_experience: z.union([z.number(), z.string()]),
  tags: z
    .array(z.string())
    .min(3, { message: "Kamida 3 ta kalit so'z kiriting" }),
});

type courseFormSchema = z.infer<typeof courseSchema>;

interface IProps {
  vacancy?: Vacancy;
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ vacancy, setSheetOpen }: IProps) {
  const { triggerVacancyCreate, isPending: isCourseCreatePending } =
    useCreateVacancy({ setSheetOpen });
  const { triggerVacancyEdit, isPending: isCourseEditPending } = useEditVacancy(
    {
      id: vacancy?.id,
      setSheetOpen,
    }
  );
  
  const form = useForm<courseFormSchema>({
    resolver: zodResolver(courseSchema),mode:'onChange',
    defaultValues: vacancy
      ? {
          title: vacancy.title,
          description: vacancy.description,
          company: vacancy.company,
          salary: vacancy.salary,
          type: vacancy.type,
          from_experience: vacancy.from_experience,
          to_experience: vacancy.to_experience,
          tags: vacancy.tags,
        }
      : {
          title: "",
          description: "",
          company: "",
          salary: 0,
          type: VacancyType.EMPTY,
          from_experience: 0,
          to_experience: 0,
          tags: [""],
        },
  });

  async function onSubmit(formValues: courseFormSchema) {
    const { from_experience ,to_experience , salary} = formValues
    
    if (vacancy) {
      triggerVacancyEdit({ ...formValues, from_experience: +from_experience,to_experience:+ to_experience ,salary: + salary});
    } else {
      triggerVacancyCreate({ ...formValues, from_experience: +from_experience,to_experience:+ to_experience ,salary: + salary});
    }
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
            name="company"
            label="Kompaniya nomi"
            placeholder="Google"
            required
          />

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
          
          <DoubleNumberField  name1={"from_experience"} name2={"to_experience"} label1="Boshlang'ich" label2="Maximal" required />
          <TextAreaField name="description" label="Vakansiya Tarifi " required />
          <KeywordField name="tags" label="Talab qilinadigan skillar" placeholder="React.js" required />

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
