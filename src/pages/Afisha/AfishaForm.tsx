import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Afisha, AfishaInput } from 'modules/afisha/types';
import { NotificationType } from 'modules/notifications/types';

import useFileUploader from 'hooks/useFileUploader';
import { useCreateAfisha } from 'modules/afisha/hooks/useCreateAfisha';
import { useEditAfisha } from 'modules/afisha/hooks/useEditAfisha';
import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import { Form } from 'components/ui/form';
import {
  FileField,
  TextAreaField,
  TextField,
  RichTextEditor,
} from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NotificationSwitch from 'components/NotificationSwitch';
import { AlertDialog } from 'components/AlertDialog';
import removeHtmlTags from 'utils/removeHtmlTags';

const afishaSchema = z.object({
  title: z.string().min(1, { message: 'Afisha nomi talab qilinadi' }),
  short_description: z
    .string()
    .min(3, { message: 'Qisqacha tavsif talab qilinadi' }),
  content: z.string().min(20, { message: 'Tavsif talab qilinadi' }),
  photo: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(1, { message: 'Rasm talab qilinadi' }),
  ]),
});

type afishaFormSchema = z.infer<typeof afishaSchema>;

interface IProps {
  afisha?: Afisha;
  setSheetOpen: (state: boolean) => void;
}

export default function AfishaForm({ afisha, setSheetOpen }: IProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const { triggerNotificationCreate } = useCreateNotification({
    setSheetOpen: () => {},
  });

  const { uploadFile } = useFileUploader();
  const {
    triggerAfishaCreate,
    isPending: isAfishaCreatePending,
    data,
  } = useCreateAfisha();
  const { triggerAfishaEdit, isPending: isAfishaEditPending } = useEditAfisha({
    id: afisha?.id,
    setSheetOpen,
  });

  const form = useForm<afishaFormSchema>({
    resolver: zodResolver(afishaSchema),
    defaultValues: afisha
      ? {
          title: afisha.title,
          short_description: afisha.short_description,
          content: afisha.content,
          photo: afisha.photo,
        }
      : {
          title: '',
          short_description: '',
          content: '',
          photo: undefined,
        },
  });

  const sendNotification = async () => {
    const afisha = data?.data?.data;
    if (afisha) {
      await triggerNotificationCreate({
        title: afisha.title,
        body: removeHtmlTags(afisha.content),
        image: afisha.photo,
        type: NotificationType.AFISHA,
        entityid: afisha.id,
      });
      setSheetOpen(false);
    }
  };

  async function onSubmit(formValues: afishaFormSchema) {
    const values = await uploadFile<AfishaInput>(formValues, 'photo');

    if (afisha) {
      triggerAfishaEdit(values);
    } else {
      await triggerAfishaCreate(values);
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
            <TextField name="title" label="Afisha nomi" required />
            <TextAreaField
              name="short_description"
              label="Afisha qisqacha tavsifi"
              required
            />
            <RichTextEditor name="content" label="Afisha tavsifi" required />
            <FileField name="photo" label="Afisha rasmi" required />

            {!afisha && (
              <NotificationSwitch
                isNotified={isNotified}
                setIsNotified={setIsNotified}
              />
            )}
          </div>
          {afisha ? (
            <LoadingButton isLoading={isAfishaEditPending}>
              Tahrirlash
            </LoadingButton>
          ) : (
            <LoadingButton isLoading={isAfishaCreatePending}>
              Saqlash
            </LoadingButton>
          )}
        </form>
      </Form>
      <AlertDialog
        alertTitle="Yaratilayotgan afisha bildirishnoma sifatida jo'natilishini xohlaysizmi?"
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
