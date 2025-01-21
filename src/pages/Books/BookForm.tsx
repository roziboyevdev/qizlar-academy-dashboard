import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Book, BookInput } from 'modules/books/types';
import { NotificationType } from 'modules/notifications/types';

import useFileUploader from 'hooks/useFileUploader';
import { useCreateBook } from 'modules/books/hooks/useCreateBook';
import { useEditBook } from 'modules/books/hooks/useEditBook';
import { useCreateNotification } from 'modules/notifications/hooks/useCreateNotification';
import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import NotificationSwitch from 'components/NotificationSwitch';
import { AlertDialog } from 'components/AlertDialog';
import removeHtmlTags from 'utils/removeHtmlTags';

const bookSchema = z.object({
  name: z.string().min(3, { message: 'Kitob nomini kiriting' }),
  description: z.string().min(3, { message: 'Tavsif talab qilinadi' }),
  image: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Rasm talab qilinadi',
    }),
    z.string().min(1, { message: 'Rasm talab qilinadi' }),
  ]),
  // mutolaa_deep_link: z.string().url({ message: "Noto'g'ri link kiritilgan" }),
  download_link: z.union([
    z.custom<File>(file => file instanceof File, {
      message: 'Kitob fayl talab qilinadi',
    }),
    z.object({
      name: z.string(),
      url: z.string().min(1, { message: 'Kitob fayl talab qilinadi' }),
    }),
  ]),
  author: z.string().min(1, { message: 'Kitob muallifini kiriting' }),
});

type bookFormSchema = z.infer<typeof bookSchema>;

interface IProps {
  book?: Book;
  setSheetOpen: (state: boolean) => void;
}

export default function BookForm({ book, setSheetOpen }: IProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const { triggerNotificationCreate } = useCreateNotification({
    setSheetOpen: () => {},
  });

  const { uploadFile, isPending: isFileUploadPending } = useFileUploader();
  const {
    triggerBookCreate,
    isPending: isBookCreatePending,
    data,
  } = useCreateBook();
  const { triggerBookEdit, isPending: isBookEditPending } = useEditBook({
    id: book?.id,
    setSheetOpen,
  });

  const form = useForm<bookFormSchema>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          name: book.name,
          description: book.description,
          image: book.image,
          download_link: {
            name: book.download_link.name,
            url: book.download_link.url,
          },
          author: book.author,
        }
      : {
          name: '',
          description: '',
          image: undefined,
          download_link: undefined,
          author: '',
        },
  });

  const sendNotification = async () => {
    const book = data?.data?.data;
    if (book) {
      await triggerNotificationCreate({
        title: book.name,
        body: removeHtmlTags(book.description),
        image: book.image,
        type: NotificationType.BOOK,
        entityid: book.id,
      });
      setSheetOpen(false);
    }
  };

  async function onSubmit(formValues: bookFormSchema) {
    const fileName = formValues.download_link.name;
    const valuesWithBookFile = await uploadFile<BookInput>(
      formValues,
      'download_link'
    );
    const download_link = {
      url: valuesWithBookFile.download_link as string,
      name: fileName,
    };

    const values = await uploadFile<BookInput>(valuesWithBookFile, 'image');

    if (book) {
      if (formValues.download_link instanceof File) {
        triggerBookEdit({ ...values, download_link });
      } else {
        triggerBookEdit(values);
      }
    } else {
      await triggerBookCreate({ ...values, download_link });
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
            <TextField name="name" label="Kitob nomi" required />
            <TextField name="author" label="Kitob muallifi" required />
            <FileField
              name="download_link"
              label="Kitob fayli"
              isFileUpload
              required
            />
            <RichTextEditor name="description" label="Kitob tavsifi" required />
            <FileField name="image" label="Kitob rasmi" required />

            {!book && (
              <NotificationSwitch
                isNotified={isNotified}
                setIsNotified={setIsNotified}
              />
            )}
          </div>
          {book ? (
            <LoadingButton isLoading={isFileUploadPending || isBookEditPending}>
              Tahrirlash
            </LoadingButton>
          ) : (
            <LoadingButton
              isLoading={isFileUploadPending || isBookCreatePending}
            >
              Saqlash
            </LoadingButton>
          )}
        </form>
      </Form>
      <AlertDialog
        alertTitle="Yaratilayotgan kitob bildirishnoma sifatida jo'natilishini xohlaysizmi?"
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
