import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/form';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { TextField } from 'components/fields';
import { quizFormSchema } from './QuizForm';

export default function QuizOptions() {
  const { control, setValue } = useFormContext<quizFormSchema>();
  const { fields: optionsFields } = useFieldArray({
    name: 'options',
    control,
  });


  return (
    <RadioGroup
      value={`${optionsFields.findIndex(field => field.is_correct)}`}
      onValueChange={value => {
        optionsFields.forEach((_, index) => {
          setValue(`options.${index}.is_correct`, index === +value);
        });
      }}
      className="flex flex-col gap-5"
    >
      {optionsFields.map((valuesField, valuesIndex) => (
        <FormField
          control={control}
          key={valuesField.id}
          name={`options.${valuesIndex}.is_correct`}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-3">
                <FormControl>
                  <RadioGroupItem
                    value={`${valuesIndex}`}
                    checked={field.value}
                  />
                </FormControl>
                <TextField
                  name={`options.${valuesIndex}.value`}
                  placeholder="Javob matni..."
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </RadioGroup>
  );
}
