import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import http from 'services/api';

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function KeywordField({ placeholder, required, name, label }: IProps) {
  const { control, setValue, getValues } = useFormContext();
  const [values, setValues] = useState([]);
  const data =
    Array.isArray(getValues(name)) && typeof getValues(name)?.[0] == 'object'
      ? getValues(name).map((value: any) => value?.title)
      : getValues(name);
  const type = Array.isArray(values) && typeof values?.[0] == 'object' ? 'object' : 'string';
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>(data);

  const handleAddKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword)) {
      const updatedKeywords = [...keywords, keyword.trim()];
      setKeywords(updatedKeywords);
      setValue(name, updatedKeywords);
      setKeyword('');
    }
  };
  console.log(values, 'values');
  console.log(data, 'data');

  const handleRemoveKeyword = async (removeKeyword: string) => {
    if (type == 'object') {
      const findItem: any = values.find((kw: any) => kw?.title == removeKeyword);
      console.log(findItem);
      try {
        const res = await http.delete(`vacancy/skill/${findItem?.id}`);
      } catch (error) {
        alert("O'chihrishda hatolik");
        return;
      }
    }
    const updatedKeywords = keywords.filter((kw) => kw !== removeKeyword);
    setKeywords(updatedKeywords);
    setValue(name, updatedKeywords);
    console.log(removeKeyword, 'remove');
  };

  useEffect(() => {
    setValues(getValues(name) || []);
  }, []);

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
                <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-red-500 hover:text-red-700">
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
