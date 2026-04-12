import { useMutation } from '@tanstack/react-query';
import { CreateSkill } from '../api';
import { SkillInput } from '../types';
import { useToast } from 'components/ui/use-toast';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IProps {
  setSheetOpen: (state: boolean) => void;
}

export const useCreateSkill = ({ setSheetOpen }: IProps) => {
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: SkillInput) => CreateSkill(values),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Skill muvaffaqiyatli yaratildi.',
      });
      queryClient.invalidateQueries({ queryKey: ['skills_list'] });
      setSheetOpen(false);
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerSkillCreate: mutateAsync,
    isPending,
  };
};
