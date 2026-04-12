import { useMutation } from '@tanstack/react-query';
import { DeleteSkill } from '../api';
import { useToast } from 'components/ui/use-toast';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

export const useDeleteSkill = (id: string) => {
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => DeleteSkill(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Skill muvaffaqiyatli o\'chirildi.',
      });
      queryClient.invalidateQueries({ queryKey: ['skills_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerSkillDelete: mutateAsync,
    isPending,
  };
};
