import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { FileField, SelectField, TextAreaField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';
import { useEffect, useState } from 'react';
import { type BannerAdminType, bannerAdminTypeValues, schema, useFormSchemaType } from './schema';
import { BannerInputType, Banner, BannerType, BannerLocationType } from 'modules/banner/types';
import { useEditBanner } from 'modules/banner/hooks/useEdit';
import { useCreateBanner } from 'modules/banner/hooks/useCreate';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';
import { SelectType } from 'types/selectField';
import { cleanEmptyStrings } from 'utils/clearEmptyKeys';
import CustomSwitch from 'components/SwitchIsDreft';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  banner?: Banner;
  setSheetOpen: (state: boolean) => void;
}

const locationData = [
  { type: BannerLocationType.HOME, name: 'Home' },
  { type: BannerLocationType.SHOP, name: "Do'kon" },
  { type: BannerLocationType.PORTFOLIO_LEADERBOARD, name: 'Portfolio Leaderboard' },
];

const bannerAdminTypeSelectData = [
  { type: BannerType.COURSE, name: 'Kurs (COURSE)' },
  { type: BannerType.LEADERBOARD, name: 'Leaderboard (LEADERBOARD)' },
  { type: BannerType.PROFILE, name: 'Profil (PROFILE)' },
  { type: BannerType.MY_COURSES, name: 'Mening kurslarim (MY_COURSES)' },
  { type: BannerType.SHOP, name: "Do'kon (SHOP)" },
  { type: BannerType.VACANCY, name: 'Vacancy (VACANCY)' },
  { type: BannerType.NONE, name: 'None (NONE)' },
];

const coerceAdminBannerType = (t?: BannerType): BannerAdminType => {
  if (!t) return BannerType.COURSE;
  return (bannerAdminTypeValues as readonly string[]).includes(t) ? (t as BannerAdminType) : BannerType.COURSE;
};



export default function CustomForm({ banner, setSheetOpen }: IProps) {
  const [coursesData, setCoursesData] = useState<SelectType[]>([]);

  const [state, setState] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(banner ? banner.isActive ?? true : true);
  const { uploadFile } = useFileUploader();
  const { triggerCreate } = useCreateBanner({
    setSheetOpen,
  });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditBanner({
    id: banner?.id,
    setSheetOpen,
  });
  const { data: coursesList } = useCoursesList();

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: banner
      ? {
          title: banner?.title,
          content: banner?.content,
          photo: banner?.photo ? normalizeImgUrl(banner.photo) : '',
          type: coerceAdminBannerType(banner?.type),
          location: banner?.location ?? BannerLocationType.HOME,
          link: banner?.link ?? '',
          targetId: banner?.targetId ?? banner?.objectId ?? '',
          isActive: banner?.isActive ?? true,
        }
      : {
          title: '',
          content: '',
          photo: '',
          type: BannerType.COURSE,
          location: BannerLocationType.HOME,
          link: '',
          targetId: '',
          isActive: true,
        },
  });

  async function onSubmit(formValues: useFormSchemaType) {
    setState(true);
    try {
      const values = await uploadFile<BannerInputType>(formValues, 'photo');
      const payload = cleanEmptyStrings({
        ...values,
        isActive,
      } as BannerInputType);

      if (banner) {
        triggerEdit(payload);
      } else {
        await triggerCreate(payload);
      }
    } catch (error) {
      alert('Aniqlanmagan hatolik!');
    } finally {
      setState(false);
    }
  }

  const type = form.watch('type');

  useEffect(() => {
    let newArr: SelectType[] = [];
    coursesList.forEach((el) =>
      newArr.push({
        name: el.title,
        type: el.id,
      })
    );
    setCoursesData(newArr);
  }, [coursesList]);



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" key="title" label="Sarlavha (title)" required />
          <SelectField name="location" data={locationData} placeholder="Joylashuvni tanlang..." label="Joylashuv (location)" required />
          <SelectField name="type" data={bannerAdminTypeSelectData} placeholder="Banner turini tanlang..." label="Tur (type)" required />

          <FileField name="photo" label="Rasm (photo)" required />
          <TextAreaField name="content" label="Kontent (content)" required />
          <TextField name="link" label="Havola (link)" />

          {type === BannerType.COURSE ? (
            coursesData?.length ? (
              <SelectField
                name="targetId"
                key="targetId"
                data={coursesData}
                placeholder="Kursni tanlang..."
                label="Maqsad ID (targetId) — kurs"
                required
              />
            ) : (
              <div className="text-sm text-muted-foreground">Kurslar ro‘yxati yuklanmadi.</div>
            )
          ) : (
            <TextField name="targetId" label="Maqsad ID (targetId)" placeholder="UUID" />
          )}

          <CustomSwitch
            state={isActive}
            setState={setIsActive}
            labelText={isActive ? 'Faol banner' : 'Faol emas banner'}
          />
        </div>
        {banner ? (
          <LoadingButton isLoading={isNotificationEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={state}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
