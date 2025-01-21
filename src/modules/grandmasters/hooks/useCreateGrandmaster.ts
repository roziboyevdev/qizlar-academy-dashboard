import { useMutation } from '@tanstack/react-query';

import { useToast } from 'components/ui/use-toast';
import { CreateGrandmaster } from '../api';
import { GrandmasterInput } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

export const useCreateGrandmaster = () => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError, data } = useMutation({
    mutationFn: (values: GrandmasterInput) => CreateGrandmaster(values),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Grandmaster muvaffaqiyatli yaratildi.',
      });
      queryClient.invalidateQueries({ queryKey: ['grandmasters_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerGrandmasterCreate: mutateAsync,
    isPending,
    isSuccess,
    isError,
    data,
  };
};
