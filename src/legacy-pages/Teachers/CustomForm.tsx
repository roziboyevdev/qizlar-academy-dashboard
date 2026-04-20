import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { FileField, TextField, TextAreaField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader from 'hooks/useFileUploader';
import { useEffect, useState } from 'react';
import { schema, useFormSchemaType } from './schema';
import { TeacherInputType, TeacherType } from 'modules/teachers/types';
import { useCreateTeacher } from 'modules/teachers/hooks/useCreate';
import { useEditTeacher } from 'modules/teachers/hooks/useEdit';

interface IProps {
  certificate?: TeacherType;
  setSheetOpen: (state: boolean) => void;
}

export default function CustomForm({ certificate, setSheetOpen }: IProps) {
  const [state, setState] = useState(false);
  const { uploadFile } = useFileUploader();
  const { triggerCreate } = useCreateTeacher({
    setSheetOpen,
  });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditTeacher({
    id: certificate?.id ?? '',
    setSheetOpen,
  });

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: '',
      photo: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (certificate) {
      form.reset({
        fullname: certificate.fullname ?? '',
        photo: certificate.photo ?? '',
        bio: certificate.bio ?? '',
      });
    } else {
      form.reset({ fullname: '', photo: '', bio: '' });
    }
  }, [certificate, form]);

  async function onSubmit(formValues: useFormSchemaType) {
    setState(true);
    try {
      const withPhoto = await uploadFile<TeacherInputType>(formValues, 'photo');
      const payload: TeacherInputType = {
        fullname: String(withPhoto.fullname ?? '').trim(),
        photo: String(withPhoto.photo ?? '').trim(),
        bio: String(withPhoto.bio ?? '').trim(),
      };

      if (!certificate?.id && !payload.photo) {
        alert('Yangi ustoz uchun rasm yuklang');
        return;
      }

      if (certificate?.id) {
        await triggerEdit(payload);
      } else {
        await triggerCreate(payload);
      }
    } catch {
      alert('Aniqlanmagan hatolik!');
    } finally {
      setState(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="fullname" label="To‘liq ism" required />
          <TextAreaField name="bio" label="Bio" placeholder="Ustoz haqida qisqacha" />
          <FileField name="photo" label="Rasm" />
        </div>
        {certificate ? (
          <LoadingButton isLoading={isNotificationEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={state}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
