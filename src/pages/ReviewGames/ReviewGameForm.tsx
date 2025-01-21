import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReviewGame, ReviewGameInput } from 'modules/review-games/types';
import { NotificationType } from 'modules/notifications/types';

import useFileUploader from 'hooks/useFileUploader';
import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import { useCreateReviewGame } from 'modules/review-games/hooks/useCreateReviewGame';
import { useEditReviewGame } from 'modules/review-games/hooks/useEditReviewGame';
import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NotificationSwitch from 'components/NotificationSwitch';
import { AlertDialog } from 'components/AlertDialog';
import removeHtmlTags from 'utils/removeHtmlTags';

const reviewGameSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  youtube_link: z.string().url(),
  thumbnail: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(1, { message: 'Rasm talab qilinadi' }),
  ]),
});

type reviewGameFormSchema = z.infer<typeof reviewGameSchema>;

interface IProps {
  reviewGame?: ReviewGame;
  setSheetOpen: (state: boolean) => void;
}

export default function ReviewGameForm({ reviewGame, setSheetOpen }: IProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const { triggerNotificationCreate } = useCreateNotification({
    setSheetOpen: () => {},
  });

  const { uploadFile } = useFileUploader();
  const {
    triggerReviewGameCreate,
    isPending: isReviewGameCreatePending,
    data,
  } = useCreateReviewGame();
  const { triggerReviewGameEdit, isPending: isReviewGameEditPending } =
    useEditReviewGame({
      id: reviewGame?.id,
      setSheetOpen,
    });

  const form = useForm<reviewGameFormSchema>({
    resolver: zodResolver(reviewGameSchema),
    defaultValues: reviewGame
      ? {
          title: reviewGame.title,
          description: reviewGame.description,
          youtube_link: reviewGame.youtube_link,
          thumbnail: reviewGame.thumbnail,
        }
      : {
          title: '',
          description: '',
          youtube_link: '',
          thumbnail: undefined,
        },
  });

  const sendNotification = async () => {
    const reviewGame = data?.data?.data;
    if (reviewGame) {
      await triggerNotificationCreate({
        title: reviewGame.title,
        body: removeHtmlTags(reviewGame.description),
        image: reviewGame.thumbnail,
        type: NotificationType.REVIEW,
        entityid: reviewGame.id,
      });
      setSheetOpen(false);
    }
  };

  async function onSubmit(formValues: reviewGameFormSchema) {
    const values = await uploadFile<ReviewGameInput>(formValues, 'thumbnail');

    if (reviewGame) {
      triggerReviewGameEdit(values);
    } else {
      await triggerReviewGameCreate(values);
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
            <TextField name="title" label="Tahlil nomi" required />
            <TextField
              name="youtube_link"
              label="Tahlil youtube havolasi"
              required
            />
            <RichTextEditor name="description" label="Tahlil izohi" required />
            <FileField name="thumbnail" label="Tahlil rasmi" required />

            {!reviewGame && (
              <NotificationSwitch
                isNotified={isNotified}
                setIsNotified={setIsNotified}
              />
            )}
          </div>
          {reviewGame ? (
            <LoadingButton isLoading={isReviewGameEditPending}>
              Tahrirlash
            </LoadingButton>
          ) : (
            <LoadingButton isLoading={isReviewGameCreatePending}>
              Saqlash
            </LoadingButton>
          )}
        </form>
      </Form>
      <AlertDialog
        alertTitle="Yaratilayotgan tahlil bildirishnoma sifatida jo'natilishini xohlaysizmi?"
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
