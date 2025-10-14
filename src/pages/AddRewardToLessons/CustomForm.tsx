import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { SelectField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';
import { useCoursesList } from 'modules/courses/hooks/useCoursesList';
import { useEffect, useState } from 'react';
import { schema, useFormSchemaType } from './schema';
import { ICourseReward, ICourseRewardInput } from 'modules/add-reward-to-lessons/types';
import VideoUploadField from 'components/fields/VideoUploder';
import { useCourseLessonsList } from 'modules/lessons/hooks/useCourseLessonsList';
import { useCreateCourseReward } from 'modules/add-reward-to-lessons/hooks/useCreate';
import { useEditCourseReward } from 'modules/add-reward-to-lessons/hooks/useEdit';
import { useLessonRewardList } from 'modules/course-reward-product/hooks/useList';
import { useSearchParams } from 'react-router-dom';

interface IProps {
  selectedData?: ICourseReward;
  setSheetOpen: (state: boolean) => void;
}

export type SelectType = { name: string; type: string; disabled?: boolean };

export default function CustomForm({ selectedData, setSheetOpen }: IProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [coursesData, setCoursesData] = useState<SelectType[]>([]);
  const [lessonsData, setLessonsData] = useState<SelectType[]>([]);
  const [rewardsData, setRewardsData] = useState<SelectType[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [state, setState] = useState(false);

  const { uploadFile } = useFileUploader();
  const { triggerCreate, isPending: isInfoCreatePending } = useCreateCourseReward({ setSheetOpen });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditCourseReward({
    id: selectedData?.id,
    setSheetOpen,
  });

  // Get data
  const { data: coursesList, isLoading: loadingCourses } = useCoursesList();
  const { data: lessons, isLoading: loadingLessons } = useCourseLessonsList(selectedCourseId);
  const { data: rewards, isLoading: loadingRewards } = useLessonRewardList(100);

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: selectedData
      ? {
          courseId: selectedData ? searchParams.get('courseId') || '' : '',
          lessonId: selectedData.lessonId || '',
          rewardId: selectedData.rewardId || '',
          file: selectedData.file || '',
        }
      : {
          courseId: '',
          lessonId: '',
          rewardId: '',
          file: '',
        },
  });

  // Watch courseId changes
  const watchedCourseId = form.watch('courseId');

  async function onSubmit(formValues: useFormSchemaType) {
    setState(true);
    try {
      let payload: ICourseRewardInput = {
        courseId: formValues.courseId,
        lessonId: formValues.lessonId,
        rewardId: formValues.rewardId,
        file: formValues.file || '',
      };

      // Agar file File tipida bo'lsa, uni yuklash
      if (formValues.file && formValues.file instanceof File) {
        payload = await uploadFile<ICourseRewardInput>(formValues, 'file');
        delete payload.rewardId;
      }

      if (selectedData) {
        triggerEdit(payload);
      } else {
        triggerCreate(payload);
      }
    } catch (error) {
      alert('Aniqlanmagan hatolik!');
    } finally {
      setState(false);
    }
  }

  // Update courses dropdown
  useEffect(() => {
    if (coursesList) {
      const newArr: SelectType[] = coursesList.map((el) => ({
        name: el.title,
        type: el.id,
      }));
      setCoursesData(newArr);
    }
  }, [coursesList]);

  // Update selected course and reset lesson when course changes
  useEffect(() => {
    if (watchedCourseId) {
      setSelectedCourseId(watchedCourseId);
      // Reset lessonId when course changes
      // if (watchedCourseId !== selectedData?.courseId) {
      //   form.setValue('lessonId', '');
      // }
    }
  }, [watchedCourseId, form, selectedData]);

  // Update lessons dropdown
  useEffect(() => {
    if (lessons) {
      const newArr: SelectType[] = lessons.map((el) => ({
        name: el.title,
        type: el.id,
      }));
      setLessonsData(newArr);
    } else {
      setLessonsData([]);
    }
  }, [lessons]);

  // Update rewards dropdown
  useEffect(() => {
    if (rewards) {
      const newArr: SelectType[] = rewards.map((el) => ({
        name: el.title,
        type: el.id,
      }));
      setRewardsData(newArr);
    }
  }, [rewards]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          {/* Kurs tanlash */}
          {loadingCourses ? (
            <SelectField name="courseId" data={[]} placeholder="Kurslar yuklanmoqda..." label="Kursni tanlang" />
          ) : (
            <SelectField name="courseId" data={coursesData} placeholder="Kursni tanlang..." label="Kursni tanlang" />
          )}

          {/* Dars tanlash */}
          {loadingLessons ? (
            <SelectField name="lessonId" data={[]} placeholder="Darslar yuklanmoqda..." label="Darsni tanlang" />
          ) : (
            <SelectField
              name="lessonId"
              data={lessonsData}
              placeholder={!lessonsData?.length ? 'Darslar yoq' : selectedCourseId ? 'Darsni tanlang...' : 'Avval kursni tanlang'}
              label="Darsni tanlang"
            />
          )}

          {/* Mukofot ID yoki Fayl (kamida bittasi majburiy) */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">* Mukofot ID yoki fayl yuklash majburiy (kamida bittasi)</p>
          </div>

          {/* Mukofot ID tanlash */}
          {loadingRewards ? (
            <SelectField name="rewardId" data={[]} placeholder="Mukofotlar yuklanmoqda..." label="Mukofot ID (ixtiyoriy)" />
          ) : (
            <SelectField name="rewardId" data={rewardsData} placeholder="Mukofotni tanlang..." label="Mukofot ID (ixtiyoriy)" />
          )}

          {/* Fayl yuklash */}
          <VideoUploadField
            name="file"
            label="Mukofot fayli (ixtiyoriy)"
            defaultValue={typeof selectedData?.file === 'string' ? selectedData.file : undefined}
            types={['JPG', 'PNG', 'GIF', 'MP4']}
          />
        </div>

        <LoadingButton isLoading={state || isInfoCreatePending || isNotificationEditPending}>
          {selectedData ? 'Tahrirlash' : 'Saqlash'}
        </LoadingButton>
      </form>
    </Form>
  );
}
