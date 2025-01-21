import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

import { LiveStreamInput } from '../types';
import { EditLiveStream } from '../api';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  id?: string;
  setSheetOpen: (state: boolean) => void;
}

export const useEditLiveStream = ({ id = '', setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: LiveStreamInput) => EditLiveStream({ values, id }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Tasdiqlandi!',
        description: 'Jonli efir muvaffaqiyatli tahrirlandi.',
      });
      queryClient.invalidateQueries({ queryKey: ['live-streams_list'] });
      setSheetOpen(false);
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerLiveStreamEdit: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
