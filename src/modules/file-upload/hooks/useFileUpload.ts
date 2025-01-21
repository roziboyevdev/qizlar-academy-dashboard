import { useMutation } from '@tanstack/react-query';
import { FileUpload } from '../api';
import { showErrorToast } from 'utils/showErrorToast';

export const useFileUpload = () => {
  const { mutateAsync, isSuccess, isError, isPending } = useMutation({
    mutationFn: (file: FormData) => FileUpload(file),
    onError: (error: any) => showErrorToast(error),
  });

  return { triggerFileUpload: mutateAsync, isSuccess, isError, isPending };
};
