import { useMutation } from '@tanstack/react-query';

import { useToast } from 'components/ui/use-toast';
import { UploadPromoCodesExcel } from '../api';
import type { IPromocodeUploadInput } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  setSheetOpen: (state: boolean) => void;
}

export const useCreatePromocode = ({ setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ productId, file }: IPromocodeUploadInput) => UploadPromoCodesExcel(productId, file),
    onSuccess: (res) => {
      const inserted = (res as { data?: { data?: { inserted?: number } } })?.data?.data?.inserted;
      toast({
        variant: 'success',
        title: 'Excel yuklandi',
        description:
          inserted !== undefined ? `${inserted} ta promokod qo‘shildi` : 'Promokodlar yangilandi.',
      });
      queryClient.invalidateQueries({ queryKey: ['promocodes_list'] });
      queryClient.invalidateQueries({ queryKey: ['promo_code_stats'] });
      setSheetOpen(false);
    },
    onError: (error: unknown) => showErrorToast(error),
  });

  return {
    triggerVacancyCreate: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
