import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Module } from 'modules/modules/types';

import { Form } from 'components/ui/form';
import { TextAreaField, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import { useParams } from 'react-router-dom';
import { useCreateModule } from 'modules/modules/hooks/useCreateModule';
import { useEditModule } from 'modules/modules/hooks/useEditModule';
import CustomSwitch from 'components/SwitchIsDreft';
import { useState } from 'react';

const moduleSchema = z.object({
  title: z.string().min(3),
  isActive: z.boolean().optional(),

});

type moduleFormSchema = z.infer<typeof moduleSchema>;

interface IProps {
  module?: Module;
  lastDataOrder?: number;
  setSheetOpen: (state: boolean) => void;
}



export default function ModuleForm({
  module,
  lastDataOrder: lastModuleOrder,
  setSheetOpen,
}: IProps) {
  const { courseId } = useParams();
  const initialState = module?.title ? module?.isActive : true

  const [switchState, setSwitchState] = useState<boolean>(initialState)
  const { triggerModuleCreate, isPending: isModuleCreatePending } =
    useCreateModule({ setSheetOpen });

  const { triggerModuleEdit, isPending: isModuleEditPending } = useEditModule({
    id: module?.id,
    setSheetOpen,
  });

  const form = useForm<moduleFormSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: module
      ? {
        title: module.title,
      }
      : {
        title: '',
      },
  });


  async function onSubmit(formValues: moduleFormSchema) {
    const payload  = { ...formValues, isActive: switchState,courseId: courseId ? courseId.toString() : ""}
    if (module) {
      triggerModuleEdit(payload);
    } else {
      triggerModuleCreate(payload);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Bo'lim nomi" required />

          <CustomSwitch state={switchState} setState={setSwitchState} labelText={switchState ? "Ko'rinadigan bo'lim" : "Ko'rinmaydigan bo'lim"} />
        </div>
        {module ? (
          <LoadingButton isLoading={isModuleEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={isModuleCreatePending}>
            Saqlash
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
