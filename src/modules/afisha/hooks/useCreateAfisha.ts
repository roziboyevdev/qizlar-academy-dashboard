import { useMutation } from '@tanstack/react-query';

import { useToast } from 'components/ui/use-toast';
import { CreateAfisha } from '../api';
import { AfishaInput } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

export const useCreateAfisha = () => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError, data } = useMutation({
    mutationFn: (values: AfishaInput) => CreateAfisha(values),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Afisha muvaffaqiyatli yaratildi.',
      });
      queryClient.invalidateQueries({ queryKey: ['afisha_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerAfishaCreate: mutateAsync,
    isPending,
    isSuccess,
    isError,
    data,
  };
};
