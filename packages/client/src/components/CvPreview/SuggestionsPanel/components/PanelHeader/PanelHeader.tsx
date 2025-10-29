import React from 'react';
import { Box, Typography } from '@mui/material';
import { HeaderActions } from './HeaderActions';
import { FilterButtons } from './FilterButtons';

type FilterType = 'open' | 'resolved';

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
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'white',
      }}
    >
      {/* Title and Actions */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: '1rem', color: 'text.primary' }}
        >
          Comments
        </Typography>

        <HeaderActions
          isExpanded={isExpanded}
          isGenerating={isGenerating}
          onToggleExpanded={onToggleExpanded}
          onGenerate={onGenerate}
          onClearAll={onClearAll}
        />
      </Box>

      {/* Filter Buttons */}
      <FilterButtons
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
    </Box>
  );
};
