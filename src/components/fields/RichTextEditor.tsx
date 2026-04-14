import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Textarea } from 'components/ui/textarea';

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function RichTextEditor({
  name,
  label,
  required,
  placeholder,
}: IProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {`${label} `}
              {required && (
                <span className="text-red-500 dark:text-red-900">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              value={typeof field.value === 'string' ? field.value : field.value == null ? '' : String(field.value)}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={placeholder}
              rows={10}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}