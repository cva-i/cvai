import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  ClearAll as ClearIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface HeaderActionsProps {
  isExpanded: boolean;
  isGenerating: boolean;
  onToggleExpanded: () => void;
  onGenerate: () => void;
  onClearAll: () => void;
}

interface ActionButtonConfig {
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  isExpanded,
  isGenerating,
  onToggleExpanded,
  onGenerate,
  onClearAll,
}) => {
  const actions: ActionButtonConfig[] = [
    {
      tooltip: isGenerating ? 'Generating...' : 'Generate AI suggestions',
      icon: <RefreshIcon fontSize="small" />,
      onClick: onGenerate,
      disabled: isGenerating,
    },
    {
      tooltip: 'Clear all suggestions',
      icon: <ClearIcon fontSize="small" />,
      onClick: onClearAll,
    },
    {
      tooltip: isExpanded ? 'Collapse' : 'Expand',
      icon: isExpanded ? <CollapseIcon /> : <ExpandIcon />,
      onClick: onToggleExpanded,
    },
  ];

  return (
    <Box display="flex" gap={0.5}>
      {actions.map((action, index) => (
        <Tooltip key={index} title={action.tooltip}>
          <IconButton
            size="small"
            onClick={action.onClick}
            disabled={action.disabled}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'grey.200',
                color: 'text.primary',
              },
              transition: 'all 0.2s ease-in-out',
              '&:disabled': {
                color: 'text.disabled',
              },
            }}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};
