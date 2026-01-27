import React from 'react';
import { HeaderActions } from './HeaderActions';
import { FilterButtons } from './FilterButtons';
import type { FilterType } from '../../types';

interface PanelHeaderProps {
  isExpanded: boolean;
  isGenerating: boolean;
  activeFilter: FilterType;
  onToggleExpanded: () => void;
  onGenerate: () => void;
  onClearAll: () => void;
  onFilterChange: (filter: FilterType) => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  isExpanded,
  isGenerating,
  activeFilter,
  onToggleExpanded,
  onGenerate,
  onClearAll,
  onFilterChange,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      {/* Title and Actions */}
      <div className="flex items-center justify-between mb-2">
        <h6 className="text-base font-semibold text-gray-900">Comments</h6>

        <HeaderActions
          isExpanded={isExpanded}
          isGenerating={isGenerating}
          onToggleExpanded={onToggleExpanded}
          onGenerate={onGenerate}
          onClearAll={onClearAll}
        />
      </div>

      {/* Filter Buttons */}
      <FilterButtons
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};
