import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { EditData } from '../api';
import { useToast } from 'components/ui/use-toast';
import { showErrorToast } from 'utils/showErrorToast';

/** Admin APIda `DELETE /order` yo‘q — o‘chirish o‘rniga status `CANCELLED`. */
export const useDeleteOrder = (id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: () => EditData({ id, status: 'CANCELLED' }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "Buyurtma bekor qilindi (o'chirish o'rniga)",
      });
      queryClient.invalidateQueries({ queryKey: ['order_list'] });
    },
    onError: (error: unknown) => showErrorToast(error),
  });

  return { triggerOrderDelete: mutate, isSuccess, isError };
};
