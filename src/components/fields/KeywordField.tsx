import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  
}

export default function KeywordField({ placeholder, required, name, label }: IProps) {
  const { control, setValue, getValues } = useFormContext();
  const values = getValues(name) || []
  const data = Array.isArray(values) && typeof values?.[0] == 'object' ? values.map(value => value?.title) : values
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>(data);

  const handleAddKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword)) {
      const updatedKeywords = [...keywords, keyword.trim()];
      setKeywords(updatedKeywords);
      setValue(name, updatedKeywords); // Update form value
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (removeKeyword: string) => {
    const updatedKeywords = keywords.filter((kw) => kw !== removeKeyword);
    setKeywords(updatedKeywords);
    setValue(name, updatedKeywords); // Update form value
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <div className="flex gap-2">
            <Input
              value={keyword}
              placeholder={placeholder}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button type="button" onClick={handleAddKeyword}>
              Qo'shish
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywords.map((kw, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg flex items-center gap-2"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
