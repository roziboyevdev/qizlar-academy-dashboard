import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { DeleteLiveStream } from '../api';
import { useToast } from 'components/ui/use-toast';
import { showErrorToast } from 'utils/showErrorToast';

export const useDeleteLiveStream = (id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: () => DeleteLiveStream(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "Muvaffaqiyatli o'chirildi!",
      });
      queryClient.invalidateQueries({ queryKey: ['live-streams_list'] });
    },
    onError: (error: any) => showErrorToast(error),
  });

  return { triggerLiveStreamDelete: mutate, isSuccess, isError };
};
