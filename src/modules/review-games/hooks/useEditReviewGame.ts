import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

import { ReviewGameInput } from '../types';
import { EditReviewGame } from '../api';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  id?: string;
  setSheetOpen: (state: boolean) => void;
}

export const useEditReviewGame = ({ id = '', setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: ReviewGameInput) => EditReviewGame({ values, id }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tasdiqlandi!',
        description: "O'yin tahlili muvaffaqiyatli tahrirlandi.",
      });
      queryClient.invalidateQueries({ queryKey: ['review-games_list'] });
      setSheetOpen(false);
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerReviewGameEdit: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
