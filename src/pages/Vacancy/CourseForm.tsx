import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { RichTextEditor, SelectField, TextAreaField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NumberTextField from 'components/fields/Number';
import KeywordField from 'components/fields/KeywordField';
import { Vacancy, VacancyType } from 'modules/vacancy/types';
import { useCreateVacancy } from 'modules/vacancy/hooks/useCreateCourse';
import { useEditVacancy } from 'modules/vacancy/hooks/useEditCourse';
import DoubleNumberField from 'components/fields/DoubleInput';

const typeData = [
  { type: VacancyType.FULL_TIME, name: "To'liq vaqt" },
  { type: VacancyType.ONE_TIME, name: 'Bir martalik' },
  { type: VacancyType.INTERN, name: 'Amalyot' },
];

const courseSchema = z.object({
  title: z.string().min(6, { message: "Title eng kamida 6 ta harfdan iborat bo'lsin" }),
  description: z.string().min(20, {
    message: 'description uchun kamida 20 ta harifdan iforat text kirgazing',
  }),
  company: z.string({ message: 'Companiya nomi kiritlishi shart' }),
  address: z.string({ message: 'Manzil kiritlishi shart' }),
  salary: z.union([z.number(), z.string()]),
  type: z.nativeEnum(VacancyType),
  fromExperience: z.union([z.number(), z.string()]),
  toExperience: z.union([z.number(), z.string()]),
  skills: z.array(z.string()).min(3, { message: "Kamida 3 ta kalit so'z kiriting" }),
});

type courseFormSchema = z.infer<typeof courseSchema>;

interface IProps {
  vacancy?: Vacancy;
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ vacancy, setSheetOpen }: IProps) {
  const { triggerVacancyCreate, isPending: isCourseCreatePending } = useCreateVacancy({ setSheetOpen });
  const { triggerVacancyEdit, isPending: isCourseEditPending } = useEditVacancy({
    id: vacancy?.id,
    setSheetOpen,
  });

  const form = useForm<courseFormSchema>({
    resolver: zodResolver(courseSchema),
    mode: 'onSubmit',
    defaultValues: vacancy
      ? {
          title: vacancy?.title,
          address: vacancy?.address,
          description: vacancy?.description,
          company: vacancy?.company,
          // address: vacancy?.address,
          salary: vacancy?.salary,
          type: vacancy?.type,
          fromExperience: vacancy?.fromExperience,
          toExperience: vacancy?.toExperience,
          skills: vacancy?.skills,
        }
      : {
          title: '',
          address: '',
          description: '',
          company: '',
          salary: 0,
          type: VacancyType.EMPTY,
          fromExperience: 0,
          toExperience: 0,
          skills: [''],
        },
  });

  async function onSubmit(formValues: courseFormSchema) {
    const { fromExperience, toExperience, salary } = formValues;

    if (vacancy) {
      triggerVacancyEdit({
        ...formValues,
        fromExperience: +fromExperience,
        toExperience: +toExperience,
        salary: +salary,
      });
    } else {
      triggerVacancyCreate({
        ...formValues,
        fromExperience: +fromExperience,
        toExperience: +toExperience,
        salary: +salary,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Vakansiya nomi" required placeholder="Frontendchi kerak" />

          <TextField name="company" label="Kompaniya nomi" placeholder="Google" required />

          <TextField name="address" label="Manzil" required placeholder="Toshkent , Uzbekistan" />

          <SelectField name="type" data={typeData} placeholder="Vakansiya turi..." label="Vakansiya turi" />

          <NumberTextField name="salary" placeholder="Oylik maosh" label="Oylik maosh" required />

          {/* <DoubleNumberField name1={'fromExperience'} name2={'toExperience'} label1="Boshlang'ich" label2="Maximal" required /> */}

          <div>
            <h2 className="font-medium">Talab etadigan tajriba</h2>
            <div className="flex items-end gap-2">
              <NumberTextField name={'fromExperience'} label="Boshlang'ich"  required />
              <NumberTextField name={'toExperience'} label="Maximal"  required />
            </div>
          </div>

          <RichTextEditor name="description" label="Vakansiya Tarifi " required />
          <KeywordField name="skills" label="Talab qilinadigan skillar" placeholder="React.js" required />
        </div>
        {vacancy ? (
          <LoadingButton isLoading={isCourseEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isCourseCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
