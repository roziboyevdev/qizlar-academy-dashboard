import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

import { GrandmasterInput } from '../types';
import { EditGrandmaster } from '../api';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  id?: string;
  setSheetOpen: (state: boolean) => void;
}

export const useEditGrandmaster = ({ id = '', setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: GrandmasterInput) => EditGrandmaster({ values, id }),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Grandmaster muvaffaqiyatli tahrirlandi.',
      });
      queryClient.invalidateQueries({ queryKey: ['grandmasters_list'] });
      setSheetOpen(false);
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerGrandmasterEdit: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
