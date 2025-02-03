import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Notification,
  NotificationInput,
  NotificationType,
} from 'modules/notifications/types';

import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import { useEditNotification } from 'modules/notifications/hooks/useEditNotification';
import { Form } from 'components/ui/form';
import {
  FileField,
  TextField,
  RichTextEditor,
  TextAreaField,
} from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';

const notificationSchema = z.object({
  title: z.string().min(3, { message: 'Bilidirishnoma nomi talab qilinadi' }),
  content: z.string().min(3, { message: 'Bilidirishnoma matni talab qilinadi' }),
  body: z.string().min(3, { message: 'Bilidirishnoma matni talab qilinadi' }),
  photo: z
    .union([
      z.custom<File>(file => file instanceof File, {
        message: 'Rasm talab qilinadi',
      }),
      z.string(),
    ])
    .optional(),
  type: z.nativeEnum(NotificationType).optional(),
});

type notificationFormSchema = z.infer<typeof notificationSchema>;

interface IProps {
  notification?: Notification;
  setSheetOpen: (state: boolean) => void;
}

export default function NotificationForm({
  notification,
  setSheetOpen,
}: IProps) {
  const { uploadFile } = useFileUploader();
  const { triggerNotificationCreate, isPending: isNotificationCreatePending } =
    useCreateNotification({ setSheetOpen });
  const { triggerNotificationEdit, isPending: isNotificationEditPending } =
    useEditNotification({
      id: notification?.id,
      setSheetOpen,
    });

  const form = useForm<notificationFormSchema>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notification
      ? {
          title: notification.title,
          content: notification.content,
          photo: notification.photo,
          body: notification.body,
          // type: notification.type,
        }
      : {
          title: '',
          content: '',
          body: '',
          photo: undefined,
          // type: undefined,
        },
  });

  async function onSubmit(formValues: notificationFormSchema) {
    const values = await uploadFile<NotificationInput>(formValues, 'photo');

    if (notification) {
      triggerNotificationEdit(values);
    } else {
      triggerNotificationCreate(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Bildirishnoma nomi" required />
           <TextAreaField name="body" label="Bildirishnoma matni" required /> 
          <RichTextEditor name="content" label="Bildirishnoma kontenti(html)" required />
          <FileField name="photo" label="Bildirishnoma rasmi" />

          {/* <SelectField
            name="type"
            data={notificationType}
            placeholder="Bildirishnoma turi..."
            label="Bildirishnoma turini tanglang"
          /> */}
        </div>
        {notification ? (
          <LoadingButton isLoading={isNotificationEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={isNotificationCreatePending}>
            Saqlash
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
