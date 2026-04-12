import { useMutation } from '@tanstack/react-query';
import { useToast } from 'components/ui/use-toast';

import { QuizInput } from '../types';
import { EditQuiz } from '../api';
import { queryClient } from 'services/react-query';
import { showErrorToast } from 'utils/showErrorToast';

interface IHook {
  setSheetOpen: (state: boolean) => void;
}

export type LastExamEditVariables = { id: string; values: QuizInput };

export const useEditQuiz = ({ setSheetOpen }: IHook) => {
  const { toast } = useToast();

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ id, values }: LastExamEditVariables) => {
      if (!id) {
        return Promise.reject(new Error('Quiz identifikatori topilmadi'));
      }
      return EditQuiz({ values, id });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Exam test muvaffaqiyatli tahrirlandi.',
      });
      queryClient.invalidateQueries({ queryKey: ['exam_list'] });
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
