import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

interface IHook {
  id?: string;
  setSheetOpen: (state: boolean) => void;
}

/** Swaggerda promokod qatorini PATCH qilish yo‘q */
export const useEditPromocode = ({ setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      toast({
        variant: 'destructive',
        title: 'API mavjud emas',
        description: 'Promokod qatorini tahrirlash backend hujjatida ko‘rsatilmagan.',
      });
    },
    onSuccess: () => setSheetOpen(false),
  });

  return {
    triggerVacancyEdit: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
