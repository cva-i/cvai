import { useCallback, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import { Label } from '@ui/components/ui/label';

type SelectListItem = {
  id: string;
  label: string;
};

type SelectListProps<T extends SelectListItem> = {
  label: string;
  onSelect?: (itemId: string) => void;
  items: T[];
  defaultState?: string;
};

export const SelectList = <T extends SelectListItem>({
  label,
  defaultState,
  onSelect,
  items,
}: SelectListProps<T>) => {
  const [value, setValue] = useState<string>(defaultState ?? '');

  const onChange = useCallback(
    (newValue: string) => {
      if (!newValue) {
        return;
      }
      setValue(newValue);
      onSelect?.(newValue);
    },
    [onSelect]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`select-${label}`}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={`select-${label}`} className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {items.map(({ id, label: itemLabel }) => (
            <SelectItem value={id} key={id}>
              {itemLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
