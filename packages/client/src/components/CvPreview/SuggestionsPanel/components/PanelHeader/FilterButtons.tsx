import React from 'react';
import { cn } from '@ui/lib/utils';
import type { FilterType } from '../../types';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterConfig: Array<{ value: FilterType; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex gap-1">
      {filterConfig.map(({ value, label }) => {
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={cn(
              'text-xs px-2 py-1 rounded-md min-w-0',
              'transition-colors duration-150',
              isActive
                ? 'bg-violet-500 text-white hover:bg-violet-600'
                : 'text-gray-500 hover:bg-gray-200'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
