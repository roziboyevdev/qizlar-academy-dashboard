import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

import { EditQuiz } from '../api';
import type { QuizFormPayload } from '../types';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  setSheetOpen: (state: boolean) => void;
}

export type EditQuizVariables = { id: string; values: QuizFormPayload };

export const useEditQuiz = ({ setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ id, values }: EditQuizVariables) => {
      if (!id) {
        return Promise.reject(new Error('Quiz identifikatori topilmadi'));
      }
      return EditQuiz({ values, id });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Quiz muvaffaqiyatli tahrirlandi.',
      });
      queryClient.invalidateQueries({ queryKey: ['quizzes_list'] });
      setSheetOpen(false);
    },
    onError: (error: any) => showErrorToast(error),
  });

  return {
    triggerQuizEdit: mutateAsync,
    isPending,
    isSuccess,
    isError,
  };
};
