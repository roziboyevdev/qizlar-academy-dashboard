import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

/** Swaggerda promokodni DELETE qilish yo‘q */
export const useDeletePromocode = (_id: string) => {
  const { toast } = useToast();

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      toast({
        variant: 'destructive',
        title: 'API mavjud emas',
        description: 'Promokodni o‘chirish ushbu backendda ko‘rsatilmagan.',
      });
    },
  });

  return { triggerVacancyDelete: mutate, isSuccess, isError };
};
