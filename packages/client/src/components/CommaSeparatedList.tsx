import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import type { SxProps, Theme, TypographyProps } from '@mui/material';
import { Box } from '@mui/material';
import { EditableTypography } from './atoms';

export interface CommaSeparatedListProps {
  id: string;
  isEditing?: boolean;
  items?: string[];
  onSave: (items: string[]) => Promise<void>;
  labelPrefix?: ReactNode;
  sx?: SxProps<Theme>;
  textSx?: SxProps<Theme>;
  variant?: TypographyProps['variant'];
  emptyText?: string;
}

export const CommaSeparatedList = ({
  id,
  isEditing,
  items = [],
  onSave,
  labelPrefix,
  sx,
  textSx,
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
    <Box sx={sx} display="flex" alignItems="baseline" gap={0.5}>
      {labelPrefix && <Box component="span">{labelPrefix}</Box>}
      <EditableTypography
        id={id}
        variant={variant}
        isEditing={isEditing}
        value={typographyValue}
        multiline
        onSave={handleSave}
        valueRender={(v) => v ?? emptyText ?? ''}
        sx={textSx}
        textFieldProps={{
          sx: {
            width: '100%',
          },
        }}
      />
    </Box>
  );
};
