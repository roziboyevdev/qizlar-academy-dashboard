import { useMutation } from '@tanstack/react-query';

import { useToast } from 'components/ui/use-toast';
import { CreateReviewGame } from '../api';
import { ReviewGameInput } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

export const useCreateReviewGame = () => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError, data } = useMutation({
    mutationFn: (values: ReviewGameInput) => CreateReviewGame(values),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tasdiqlandi!',
        description: "O'yin tahlili muvaffaqiyatli yaratildi.",
      });
      queryClient.invalidateQueries({ queryKey: ['review-games_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerReviewGameCreate: mutateAsync,
    isPending,
    isSuccess,
    isError,
    data,
  };
};
