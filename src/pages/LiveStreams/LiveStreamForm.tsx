import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LiveStream, LiveStreamInput } from 'modules/live-streams/types';
import { NotificationType } from 'modules/notifications/types';

import useFileUploader from 'hooks/useFileUploader';
import { useCreateLiveStream } from 'modules/live-streams/hooks/useCreateLiveStream';
import { useEditLiveStream } from 'modules/live-streams/hooks/useEditLiveStream';
import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import { Form } from 'components/ui/form';
import { DatePickerField, FileField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NotificationSwitch from 'components/NotificationSwitch';
import { AlertDialog } from 'components/AlertDialog';

const liveStreamSchema = z.object({
  title: z.string().min(3, { message: 'Jonli efir nomi talab qilinadi' }),
  video_link: z.string().url({ message: "Noto'g'ri link kiritilgan" }),
  thumbnail: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(1, { message: 'Rasm talab qilinadi' }),
  ]),
  starts_at: z.date({ message: 'Efir boshlanish vaqtini kiriting' }),
  ends_at: z.date({ message: 'Efir yakunlanish vaqtini kiriting' }),
});

type liveStreamFormSchema = z.infer<typeof liveStreamSchema>;

interface IProps {
  liveStream?: LiveStream;
  setSheetOpen: (state: boolean) => void;
}

export default function LiveStreamForm({ liveStream, setSheetOpen }: IProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const { triggerNotificationCreate } = useCreateNotification({
    setSheetOpen: () => {},
  });

  const { uploadFile } = useFileUploader();
  const {
    triggerLiveStreamCreate,
    isPending: isLiveStreamCreatePending,
    data,
  } = useCreateLiveStream();
  const { triggerLiveStreamEdit, isPending: isLiveStreamEditPending } =
    useEditLiveStream({
      id: liveStream?.id,
      setSheetOpen,
    });

  const form = useForm<liveStreamFormSchema>({
    resolver: zodResolver(liveStreamSchema),
    defaultValues: liveStream
      ? {
          title: liveStream.title,
          video_link: liveStream.video_link,
          thumbnail: liveStream.thumbnail,
          starts_at: new Date(liveStream.starts_at),
          ends_at: new Date(liveStream.ends_at),
        }
      : {
          title: '',
          video_link: '',
          thumbnail: undefined,
          starts_at: undefined,
          ends_at: undefined,
        },
  });

  const sendNotification = async () => {
    const liveStream = data?.data?.data;
    if (liveStream) {
      await triggerNotificationCreate({
        title: 'Jonli efir',
        body: liveStream.title,
        image: liveStream.thumbnail,
        type: NotificationType.LIVE,
        entityid: liveStream.id,
      });
      setSheetOpen(false);
    }
  };

  async function onSubmit(formValues: liveStreamFormSchema) {
    const values = await uploadFile<LiveStreamInput>(formValues, 'thumbnail');

    if (liveStream) {
      triggerLiveStreamEdit(values);
    } else {
      await triggerLiveStreamCreate(values);
      if (isNotified) {
        setDialogOpen(true);
      } else {
        setSheetOpen(false);
      }
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-4 flex-col my-4">
            <TextField name="title" label="Jonli efir nomi" required />
            <TextField name="video_link" label="Jonli efir havolasi" required />
            <FileField name="thumbnail" label="Jonli efir rasmi" required />
            <div className="flex gap-6">
              <DatePickerField
                name="starts_at"
                placeholder="Efir boshlanish vaqti"
              />
              <DatePickerField
                name="ends_at"
                placeholder="Efir yakunlash vaqti"
              />
            </div>
            {!liveStream && (
              <NotificationSwitch
                isNotified={isNotified}
                setIsNotified={setIsNotified}
              />
            )}
          </div>
          {liveStream ? (
            <LoadingButton isLoading={isLiveStreamEditPending}>
              Tahrirlash
            </LoadingButton>
          ) : (
            <LoadingButton isLoading={isLiveStreamCreatePending}>
              Saqlash
            </LoadingButton>
          )}
        </form>
      </Form>
      <AlertDialog
        alertTitle="Yaratilayotgan jonli efir bildirishnoma sifatida jo'natilishini xohlaysizmi?"
        alertCancel="Yo'q"
        alertActionTitle="Ha"
        alertCancelFucntion={() => setSheetOpen(false)}
        alertActionFunction={sendNotification}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </>
  );
}
