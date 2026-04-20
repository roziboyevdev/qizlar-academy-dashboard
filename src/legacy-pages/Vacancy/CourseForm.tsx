import { useEffect } from 'react';
import { useSkillsList } from 'modules/skills/hooks/useSkillsList';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { RichTextEditor, SelectField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NumberTextField from 'components/fields/Number';
import KeywordField from 'components/fields/KeywordField';
import {
  Vacancy,
  VacancyCategory,
  VacancyCurrency,
  VacancyJobType,
  VacancyInput,
} from 'modules/vacancy/types';
import { useCreateVacancy } from 'modules/vacancy/hooks/useCreateCourse';
import { useEditVacancy } from 'modules/vacancy/hooks/useEditCourse';
import { vacancyFormSchema, vacancySchema } from './schema';

const categoryOptions = [
  { type: VacancyCategory.business, name: 'Biznes' },
  { type: VacancyCategory.crafts, name: 'Hunarmandchilik' },
  { type: VacancyCategory.itMedia, name: 'IT va media' },
  { type: VacancyCategory.education, name: 'Ta’lim' },
  { type: VacancyCategory.legal, name: 'Huquq' },
  { type: VacancyCategory.psychology, name: 'Psixologiya' },
  { type: VacancyCategory.health, name: 'Sog‘liq' },
  { type: VacancyCategory.family, name: 'Oilaviy' },
];

const currencyOptions = [
  { type: VacancyCurrency.UZS, name: "So'm (UZS)" },
  { type: VacancyCurrency.USD, name: 'USD' },
  { type: VacancyCurrency.EUR, name: 'EUR' },
  { type: VacancyCurrency.RUB, name: 'RUB' },
];

const jobTypeOptions = [
  { type: VacancyJobType.FULL_TIME, name: "To'liq stavka" },
  { type: VacancyJobType.PART_TIME, name: 'Yarim stavka' },
  { type: VacancyJobType.INTERN, name: 'Stajyor / amaliyot' },
  { type: VacancyJobType.REMOTE, name: 'Masofaviy' },
  { type: VacancyJobType.ONSITE, name: 'Ofisda' },
  { type: VacancyJobType.CONTRACT, name: 'Shartnoma' },
];

const emptyDefaults: vacancyFormSchema = {
  title: '',
  companyName: '',
  description: '',
  requirements: '',
  salaryFrom: 0,
  salaryTo: 0,
  category: VacancyCategory.education,
  currency: VacancyCurrency.UZS,
  location: '',
  type: VacancyJobType.FULL_TIME,
  contact: '',
  skills: [],
};

function vacancyToForm(v: Vacancy): vacancyFormSchema {
  return {
    title: v.title,
    companyName: v.companyName ?? '',
    description: v.description,
    requirements: v.requirements,
    salaryFrom: v.salaryFrom,
    salaryTo: v.salaryTo,
    category: (v.category ?? VacancyCategory.education) as VacancyCategory,
    currency: v.currency,
    location: v.location,
    type: v.type,
    contact: v.contact,
    skills: v.skills?.length ? [...v.skills] : [],
  };
}

interface IProps {
  vacancy?: Vacancy;
  setSheetOpen: (state: boolean) => void;
}

export default function CourseForm({ vacancy, setSheetOpen }: IProps) {
  const { data: skillsData } = useSkillsList(1, 100);
  const skillSuggestions = skillsData?.data?.map(s => s.name) || [];

  const { triggerVacancyCreate, isPending: isCourseCreatePending } = useCreateVacancy({ setSheetOpen });
  const { triggerVacancyEdit, isPending: isCourseEditPending } = useEditVacancy({
    id: vacancy?.id,
    setSheetOpen,
  });

  const form = useForm<vacancyFormSchema>({
    resolver: zodResolver(vacancySchema),
    mode: 'onSubmit',
    defaultValues: vacancy ? vacancyToForm(vacancy) : emptyDefaults,
  });

  useEffect(() => {
    form.reset(vacancy ? vacancyToForm(vacancy) : emptyDefaults);
  }, [vacancy, form]);

  function buildPayload(values: vacancyFormSchema): VacancyInput {
    return {
      title: values.title.trim(),
      companyName: values.companyName?.trim() || '',
      description: values.description,
      requirements: values.requirements,
      salaryFrom: Number(values.salaryFrom),
      salaryTo: Number(values.salaryTo),
      category: values.category,
      currency: values.currency,
      location: values.location.trim(),
      type: values.type,
      contact: values.contact.trim(),
      skills: values.skills || [],
    };
  }

  function onSubmit(formValues: vacancyFormSchema) {
    const payload = buildPayload(formValues);
    if (vacancy) {
      triggerVacancyEdit(payload);
    } else {
      triggerVacancyCreate(payload);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 flex flex-col gap-4">
        <TextField name="title" label="Vakansiya nomi" required placeholder="Masalan: Frontend dasturchi" />
        <TextField name="companyName" label="Kompaniya nomi (ixtiyoriy)" placeholder="Masalan: Qizlar Akademiyasi" />
        <TextField name="location" label="Joylashuv" required placeholder="Toshkent yoki Masofaviy" />
        <TextField name="contact" label="Aloqa" required placeholder="Telefon yoki email" />

        <SelectField name="category" data={categoryOptions} placeholder="Yo‘nalish" label="Kategoriya" />
        <SelectField name="currency" data={currencyOptions} placeholder="Valyuta" label="Valyuta" />
        <SelectField name="type" data={jobTypeOptions} placeholder="Ish turi" label="Ish shakli" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <NumberTextField name="salaryFrom" label="Maosh dan" placeholder="0" required />
          <NumberTextField name="salaryTo" label="Maosh gacha" placeholder="0" required />
        </div>

        <RichTextEditor name="description" label="Vakansiya tavsifi" required />
        <RichTextEditor name="requirements" label="Talablar va vazifalar" required />
        <KeywordField name="skills" label="Ko‘nikmalar (ixtiyoriy)" placeholder="React, TypeScript…" suggestions={skillSuggestions} />

        {vacancy ? (
          <LoadingButton isLoading={isCourseEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isCourseCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
