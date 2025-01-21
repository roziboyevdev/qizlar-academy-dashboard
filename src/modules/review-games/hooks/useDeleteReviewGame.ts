import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { DeleteReviewGame } from '../api';
import { useToast } from 'components/ui/use-toast';
import { showErrorToast } from 'utils/showErrorToast';

export const useDeleteReviewGame = (id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: () => DeleteReviewGame(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "Muvaffaqiyatli o'chirildi!",
      });
      queryClient.invalidateQueries({ queryKey: ['review-games_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return { triggerReviewGameDelete: mutate, isSuccess, isError };
};
