import { useFileUpload } from 'modules/file-upload/hooks/useFileUpload';

export default function useFileUploader() {
  const { triggerFileUpload, isPending } = useFileUpload();

  async function uploadFile<TData>(
    values: Record<string, any>,
    key: keyof TData & string
  ): Promise<TData> {
    const formData = new FormData();
    formData.append('file', values[key]);

    if (values[key] instanceof File) {
      const { data } = await triggerFileUpload(formData);
      return { ...values, [key]: data.data?.data } as TData;
    }

    return values as TData;
  }

  return { uploadFile, isPending };
}



export function useEasyFileUploader() {
  const { triggerFileUpload, isPending } = useFileUpload();

  async function uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    if (file instanceof File) {
      const { data } = await triggerFileUpload(formData);
      return data?.data?.data;
    }
    return '';
  }

  return { uploadFile, isPending };
}