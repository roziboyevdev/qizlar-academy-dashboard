import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

export type SelectOption = { name: string; id: string | number; disabled?: boolean; [key: string]: unknown };

interface IProps {
  placeholder?: string;
  data: SelectOption[];
  /** Tanlangan qiymat (berilsa — boshqariluvchi select). Masalan: `__all__` yoki kurs id. */
  value?: string;
  onChange?: (value: string) => void;
  isTitleKey?: boolean;
}

export default function SelectWithoutForm({ data, placeholder, value, onChange, isTitleKey }: IProps) {
  const isControlled = value !== undefined;
  const selectProps = isControlled
    ? { value: String(value) }
    : value !== undefined && value !== ''
      ? { defaultValue: String(value) }
      : {};

  return (
    <div>
      <Select {...selectProps} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem value={isTitleKey ? String(item?.name) : String(item?.id)} key={String(item?.id)} disabled={item?.disabled}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
