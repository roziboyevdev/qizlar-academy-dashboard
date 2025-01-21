import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grandmaster, GrandmasterInput } from 'modules/grandmasters/types';
import { NotificationType } from 'modules/notifications/types';

import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, TextField } from 'components/fields';
import { useCreateGrandmaster } from 'modules/grandmasters/hooks/useCreateGrandmaster';
import { useEditGrandmaster } from 'modules/grandmasters/hooks/useEditGrandmaster';
import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';
import NotificationSwitch from 'components/NotificationSwitch';
import { AlertDialog } from 'components/AlertDialog';
import removeHtmlTags from 'utils/removeHtmlTags';

const GrandmasterSchema = z.object({
  full_name: z.string().min(3, { message: 'Familya, ism talab qilinadi' }),
  description: z.string().min(3, { message: 'Tavsif talab qilinadi' }),
  video_url: z.string().url({ message: "Noto'g'ri link kiritilgan" }),
  image: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(1, { message: 'Rasm talab qilinadi' }),
  ]),
});

type GrandmasterFormSchema = z.infer<typeof GrandmasterSchema>;

interface IProps {
  grandmaster?: Grandmaster;
  setSheetOpen: (state: boolean) => void;
}

export default function GrandmasterForm({ grandmaster, setSheetOpen }: IProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const { triggerNotificationCreate } = useCreateNotification({
    setSheetOpen: () => {},
  });

  const { uploadFile } = useFileUploader();
  const {
    triggerGrandmasterCreate,
    isPending: isGrandmasterCreatePending,
    data,
  } = useCreateGrandmaster();
  const { triggerGrandmasterEdit, isPending: isGrandmasterEditPending } =
    useEditGrandmaster({
      id: grandmaster?.id,
      setSheetOpen,
    });

  const form = useForm<GrandmasterFormSchema>({
    resolver: zodResolver(GrandmasterSchema),
    defaultValues: grandmaster
      ? {
          full_name: grandmaster.full_name,
          description: grandmaster.description,
          video_url: grandmaster.video_url,
          image: grandmaster.image,
        }
      : {
          full_name: '',
          description: '',
          video_url: '',
          image: undefined,
        },
  });

  const sendNotification = async () => {
    const grandmaster = data?.data?.data;
    if (grandmaster) {
      await triggerNotificationCreate({
        title: grandmaster.full_name,
        body: removeHtmlTags(grandmaster.description),
        image: grandmaster.image,
        type: NotificationType.GRANDMASTER,
        entityid: grandmaster.id,
      });
      setSheetOpen(false);
    }
  };

  async function onSubmit(formValues: GrandmasterFormSchema) {
    const values = await uploadFile<GrandmasterInput>(formValues, 'image');

    if (grandmaster) {
      triggerGrandmasterEdit(values);
    } else {
      await triggerGrandmasterCreate(values);
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
            <TextField name="full_name" label="To'liq ismi" required />
            <RichTextEditor name="description" label="Biografiyasi" required />
            <TextField name="video_url" label="Video havolasi" required />
            <FileField name="image" label="Rasmi" required />

            {!grandmaster && (
              <NotificationSwitch
                isNotified={isNotified}
                setIsNotified={setIsNotified}
              />
            )}
          </div>
          {grandmaster ? (
            <LoadingButton isLoading={isGrandmasterEditPending}>
              Tahrirlash
            </LoadingButton>
          ) : (
            <LoadingButton isLoading={isGrandmasterCreatePending}>
              Saqlash
            </LoadingButton>
          )}
        </form>
      </Form>
      <AlertDialog
        alertTitle="Yaratilayotgan grandmaster bildirishnoma sifatida jo'natilishini xohlaysizmi?"
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
