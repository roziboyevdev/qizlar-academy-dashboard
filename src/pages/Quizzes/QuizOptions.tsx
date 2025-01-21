import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Checkbox } from "components/ui/checkbox";
import { FileField, TextField } from "components/fields";
import { quizFormSchema } from "./QuizForm";

export default function QuizOptions({ isPhoto = false }: { isPhoto?: boolean }) {
  const { control, getValues, setValue } = useFormContext<quizFormSchema>();
  const { fields: optionsFields } = useFieldArray({
    name: "options",
    control,
  });

  const quizType = getValues("type");

  if (quizType === "single_select") {
    return (
      <RadioGroup
        value={`${optionsFields.findIndex((field) => field.is_correct)}`}
        onValueChange={(value) =>
          optionsFields.forEach((_, index) => {
            setValue(`options.${index}.is_correct`, index === +value);
          })
        }
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
                  {valuesField.value.map((valueField, index) =>
                    isPhoto ? (
                    
                      <FileField
                        key={index}
                        name={`options.${valuesIndex}.value.${index}.content`}
                        label="Javob rasimini yuklang..."
                      />
                    ) : (
                      <TextField
                      key={index}
                      name={`options.${valuesIndex}.value.${index}.content`}
                      placeholder="Javob matni..."
                    />
                    )
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </RadioGroup>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {optionsFields.map((valuesField, valuesIndex) => (
        <FormField
          control={control}
          key={valuesField.id}
          name={`options.${valuesIndex}.is_correct`}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center space-x-3">
                <FormControl>
                  <Checkbox
                    value={`${valuesIndex}`}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      setValue(`options.${valuesIndex}.is_correct`, !!checked);
                    }}
                  />
                </FormControl>
                {valuesField.value.map((valueField, index) => (
                  <TextField
                    key={index}
                    name={`options.${valuesIndex}.value.${index}.content`}
                    placeholder="Javob matni..."
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
