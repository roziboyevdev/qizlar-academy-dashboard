import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';
import DateTimePicker from 'components/DateAndTimePicker';
import { StoryV2Type, MediaType, StoryV2InputType } from 'modules/story-v2/types';
import { useCreateStory } from 'modules/story-v2/hooks/useCreate';
import { useEditStory } from 'modules/story-v2/hooks/useEdit';
import { imageTypes, videoTypes } from 'constants/file';
import { schema, useFormSchemaType } from './schema';
import VideoUploadField from 'components/fields/VideoUploder';

function toDateTimeLocalValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultExpiresLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toDateTimeLocalValue(d.toISOString());
}

interface IProps {
  story?: StoryV2Type;
  setSheetOpen: (state: boolean) => void;
}

export default function CustomForm({ story, setSheetOpen }: IProps) {
  const [busy, setBusy] = useState(false);
  const { uploadFile } = useFileUploader();
  const { triggerCreate, isPending: isCreatePending } = useCreateStory({ setSheetOpen });
  const { triggerEdit, isPending: isEditPending } = useEditStory({
    id: story?.id,
    setSheetOpen,
  });

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: story
      ? {
          title: story.title ?? '',
          mediaType: story.mediaType,
          mediaUrl: story.mediaUrl,
          expiresAt: toDateTimeLocalValue(story.expiresAt),
        }
      : {
          title: '',
          mediaType: MediaType.IMAGE,
          mediaUrl: '',
          expiresAt: defaultExpiresLocal(),
        },
  });

  useEffect(() => {
    if (story) {
      form.reset({
        title: story.title ?? '',
        mediaType: story.mediaType,
        mediaUrl: story.mediaUrl,
        expiresAt: toDateTimeLocalValue(story.expiresAt),
      });
    }
  }, [story, form]);

  async function onSubmit(formValues: useFormSchemaType) {
    try {
      setBusy(true);
      let mediaUrl: string | File = formValues.mediaUrl;
      if (mediaUrl instanceof File) {
        const uploaded = await uploadFile<{ mediaUrl: string | File }>({ mediaUrl }, 'mediaUrl');
        mediaUrl = uploaded.mediaUrl as string;
      }

      const expiresAt = new Date(formValues.expiresAt).toISOString();
      const payload: StoryV2InputType = {
        mediaUrl: String(mediaUrl),
        mediaType: formValues.mediaType,
        expiresAt,
      };
      const t = formValues.title?.trim();
      if (t) payload.title = t;

      if (story) {
        triggerEdit(payload);
      } else {
        await triggerCreate(payload);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  }

  const mediaType = form.watch('mediaType');

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField name="title" label="Sarlavha (ixtiyoriy)" placeholder="128 belgigacha" />
        <SelectField
          name="mediaType"
          data={[
            { name: 'Rasm', type: MediaType.IMAGE },
            { name: 'Video', type: MediaType.VIDEO },
          ]}
          placeholder="Media turini tanlang"
          label="Media turi"
        />
        <VideoUploadField
          name="mediaUrl"
          label={mediaType === MediaType.IMAGE ? 'Story rasmi' : 'Story videosi'}
          types={mediaType === MediaType.IMAGE ? imageTypes : videoTypes}
          defaultValue={typeof story?.mediaUrl === 'string' ? story.mediaUrl : ''}
        />
        <DateTimePicker name="expiresAt" label="Tugash vaqti (expiresAt)" required />
        {story ? (
          <LoadingButton isLoading={busy || isEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={busy || isCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </FormProvider>
  );
}
