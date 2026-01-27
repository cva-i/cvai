import { useState } from 'react';
import { Input } from '@ui/components/ui/input';
import { usePreviewMode } from '../../contexts';
import { cn } from '@ui/lib/utils';

interface GenericInputFieldProps {
  onEnterKey: (inputValue: string) => void;
  placeholder?: string;
  width?: string | number;
}

export const TextInputField = ({
  onEnterKey,
  placeholder = 'Enter text',
  width = '160px',
}: GenericInputFieldProps) => {
  const [value, setValue] = useState('');

  const { isPreviewing } = usePreviewMode();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && value.trim()) {
      onEnterKey(value.trim());
      setValue('');
    }
  };

  if (isPreviewing) {
    return null;
  }
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder={placeholder}
      className={cn('text-xs h-8 border-0 border-b border-border rounded-none')}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    />
  );
};
