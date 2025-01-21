import { useMutation } from '@tanstack/react-query';

import { useToast } from 'components/ui/use-toast';
import { CreateLiveStream } from '../api';
import { LiveStreamInput } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

export const useCreateLiveStream = () => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError, data } = useMutation({
    mutationFn: (values: LiveStreamInput) => CreateLiveStream(values),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tasdiqlandi!',
        description: 'Jonli efir muvaffaqiyatli yaratildi.',
      });
      queryClient.invalidateQueries({ queryKey: ['live-streams_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerLiveStreamCreate: mutateAsync,
    isPending,
    isSuccess,
    isError,
    data,
  };
};
