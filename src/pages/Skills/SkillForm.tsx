import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skill, SkillInput } from 'modules/skills/types';
import { useCreateSkill } from 'modules/skills/hooks/useCreateSkill';
import { Form } from 'components/ui/form';
import { TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill nomi talab qilinadi'),
});

type skillFormSchema = z.infer<typeof skillSchema>;

interface IProps {
  certificate?: Skill; // naming as certificate or similar to align with existing components like TableActions
  setSheetOpen: (state: boolean) => void;
}

export default function SkillForm({ certificate: skill, setSheetOpen }: IProps) {
  const { triggerSkillCreate, isPending } = useCreateSkill({ setSheetOpen });

  const form = useForm<skillFormSchema>({
    resolver: zodResolver(skillSchema),
    defaultValues: skill ? { name: skill.name } : { name: '' },
  });

  function onSubmit(values: skillFormSchema) {
    if (skill) {
      // Edit logic if needed, but the user only gave create/findAll/remove
    } else {
      triggerSkillCreate(values as SkillInput);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField name="name" label="Skill nomi" required />
        <LoadingButton isLoading={isPending}>
          {skill ? 'Tahrirlash' : 'Saqlash'}
        </LoadingButton>
      </form>
    </Form>
  );
}
