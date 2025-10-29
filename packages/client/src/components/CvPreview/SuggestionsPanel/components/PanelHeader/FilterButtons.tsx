import React from 'react';
import { Box, Button } from '@mui/material';
import { match } from 'ts-pattern';

type FilterType = 'open' | 'resolved';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterConfig = [
  { value: 'open' as const, label: 'Open' },
  { value: 'resolved' as const, label: 'Resolved' },
];

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <Box display="flex" gap={0.5}>
      {filterConfig.map(({ value, label }) => (
        <Button
          key={value}
          size="small"
          onClick={() => onFilterChange(value)}
          sx={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.375rem',
            borderRadius: '0.375rem',
            backgroundColor: match(activeFilter === value)
              .with(true, () => 'primary.main')
              .otherwise(() => 'unset'),
            color: match(activeFilter === value)
              .with(true, () => 'white')
              .otherwise(() => 'text.secondary'),
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: match(activeFilter === value)
                .with(true, () => 'primary.dark')
                .otherwise(() => 'grey.200'),
            },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};
