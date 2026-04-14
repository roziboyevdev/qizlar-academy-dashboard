import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Module } from 'modules/modules/types';

import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import { useParams } from 'react-router-dom';
import { useCreateModule } from 'modules/modules/hooks/useCreateModule';
import { useEditModule } from 'modules/modules/hooks/useEditModule';
import CustomSwitch from 'components/SwitchIsDreft';
import { useState } from 'react';
import useFileUploader from 'hooks/useFileUploader';

const moduleSchema = z.object({
  title: z.string().min(3, { message: "Bo'lim nomi kamida 3 ta belgidan iborat bo‘lsin" }),
  description: z.string().min(3, { message: 'Tavsifni kiriting' }),
  icon: z.union([
    z.custom<File>((file) => file instanceof File, { message: 'Icon rasmi talab qilinadi' }),
    z.string().min(1, { message: 'Icon rasmi talab qilinadi' }),
  ]),
});


interface IProps {
  module?: Module;
  lastDataOrder?: number;
  setSheetOpen: (state: boolean) => void;
}

export default function ModuleForm({ module, lastDataOrder: lastModuleOrder, setSheetOpen }: IProps) {
  const { courseId } = useParams();
  const initialState = module?.title ? module?.isActive : true;

  type ModuleFormSchema = z.infer<typeof moduleSchema>;
  const [switchState, setSwitchState] = useState<boolean>(initialState);
  const { triggerModuleCreate, isPending: isModuleCreatePending } = useCreateModule({ setSheetOpen });
  const { uploadFile, isPending: isFileUpload } = useFileUploader();

  const { triggerModuleEdit, isPending: isModuleEditPending } = useEditModule({
    id: module?.id,
    setSheetOpen,
  });

  const form = useForm<ModuleFormSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: module
      ? {
        title: module.title,
        description: module.description ?? '',
        icon: module.icon ?? '',
      }
      : {
        title: '',
        description: '',
        icon: '',
      },
  });

  async function onSubmit(formValues: ModuleFormSchema) {
    const withIcon = await uploadFile<any>(formValues, 'icon');
    if (module) {
      triggerModuleEdit({
        title: withIcon.title,
        description: withIcon.description,
        icon: withIcon.icon,
        isActive: switchState,
      });
    } else {
      triggerModuleCreate({
        title: withIcon.title,
        description: withIcon.description,
        icon: withIcon.icon,
        courseId: courseId ? courseId.toString() : '',
        isActive: switchState,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Bo'lim nomi" required />
          <RichTextEditor name="description" label="Bo'lim tavsifi" required />
          <FileField name="icon" label="Icon rasmi" required />
          <CustomSwitch
            state={switchState}
            setState={setSwitchState}
            labelText={switchState ? "Ko'rinadigan bo'lim" : "Ko'rinmaydigan bo'lim"}
          />
        </div>
        {module ? (
          <LoadingButton isLoading={isFileUpload || isModuleEditPending}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isFileUpload || isModuleCreatePending}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
