import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Box, EditableTypography } from './atoms';
import { cn } from '@ui/lib/utils';
import type { TypographyVariant } from './atoms/Typography/types';

export interface CommaSeparatedListProps {
  id: string;
  isEditing?: boolean;
  items?: string[];
  onSave: (items: string[]) => Promise<void>;
  labelPrefix?: ReactNode;
  className?: string;
  textClassName?: string;
  variant?: TypographyVariant;
  emptyText?: string;
}

export const CommaSeparatedList = ({
  id,
  isEditing,
  items = [],
  onSave,
  labelPrefix,
  className,
  textClassName,
  variant = 'body2',
  emptyText,
}: CommaSeparatedListProps) => {
  const typographyValue = items?.length ? items.join(', ') : undefined;

  const handleSave = useCallback(
    (value: string) => {
      const newItems = value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      return onSave(newItems);
    },
    [onSave]
  );

  return (
    <Box
      display="flex"
      alignItems="baseline"
      gap={0.5}
      className={cn(className)}
    >
      {labelPrefix && <span>{labelPrefix}</span>}
      <EditableTypography
        id={id}
        variant={variant}
        isEditing={isEditing}
        value={typographyValue}
        multiline
        onSave={handleSave}
        valueRender={(v) => v ?? emptyText ?? ''}
        className={cn('w-full', textClassName)}
        textFieldProps={{
          className: 'w-full',
        }}
      />
    </Box>
  );
};
