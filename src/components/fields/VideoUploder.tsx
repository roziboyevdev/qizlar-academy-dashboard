import { useFormContext } from 'react-hook-form';
import { FileUploader } from 'react-drag-drop-files';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { X as CloseIcon } from 'lucide-react';
import { useState } from 'react';
import { baseMediaUrl } from 'services/api';

interface IProps {
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  types?: string[];
}

export default function MediaUploadField({ name, label, required, defaultValue, types }: IProps) {
  const { control } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setFileType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const mediaUrl = defaultValue ? `${baseMediaUrl}/${defaultValue}` : '';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {`${label} `}
              {required && <span className="text-red-500 dark:text-red-900">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {value || mediaUrl ? (
              <div className="relative p-1 border rounded-md max-w-fit">
                {fileType === 'video' ? (
                  <video
                    src={mediaUrl ? mediaUrl : previewUrl || (value instanceof File ? URL.createObjectURL(value) : '')}
                    controls
                    className="max-w-full min-w-[80%] max-h-64"
                  />
                ) : (
                  <img
                    src={mediaUrl ? mediaUrl : previewUrl || (value instanceof File ? URL.createObjectURL(value) : '')}
                    alt="Preview"
                    className="max-w-full min-w-[80%] max-h-64"
                  />
                )}
                <div
                  className="absolute top-2 right-2 cursor-pointer bg-slate-300/70"
                  onClick={() => {
                    onChange(null);
                    setPreviewUrl(null);
                    setFileType(null);
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
            ) : (
              <FileUploader
                handleChange={(file: File) => {
                  onChange(file);
                  handleFileChange(file);
                }}
                name="media"
                types={types ? types : ['MP4', 'AVI', 'MOV', 'WEBM', 'JPG', 'PNG', 'GIF']}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
