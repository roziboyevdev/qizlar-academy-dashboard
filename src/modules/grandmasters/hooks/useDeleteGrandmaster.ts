import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { DeleteGrandmaster } from '../api';
import { useToast } from 'components/ui/use-toast';
import { showErrorToast } from 'utils/showErrorToast';

export const useDeleteGrandmaster = (id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: () => DeleteGrandmaster(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "Muvaffaqiyatli o'chirildi!",
      });
      queryClient.invalidateQueries({ queryKey: ['grandmasters_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return { triggerGrandmasterDelete: mutate, isSuccess, isError };
};
