import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { EditData } from '../api';
import { useToast } from 'components/ui/use-toast';
import { showErrorToast } from 'utils/showErrorToast';

/** Swaggerda alohida cancel yo‘q — status `CANCELLED` qilib yangilanadi */
export const useCancelOrder = (id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: () => EditData({ id, status: 'CANCELLED' }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Buyurtma bekor qilindi',
      });
      queryClient.invalidateQueries({ queryKey: ['order_list'] });
    },
    onError: (error: unknown) => showErrorToast(error),
  });

  return { triggerCencelOrder: mutate, isSuccess, isError };
};
