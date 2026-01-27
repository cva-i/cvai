import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  ListX,
  RefreshCw,
} from 'lucide-react';
import { Tooltip } from '../../../../atoms/Tooltip';
import { cn } from '@ui/lib/utils';

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

const iconButtonClasses = cn(
  'inline-flex items-center justify-center rounded-lg w-8 h-8',
  'transition-all duration-200',
  'text-gray-500 hover:bg-gray-200 hover:text-gray-900',
  'disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent'
);

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
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: onGenerate,
      disabled: isGenerating,
    },
    {
      tooltip: 'Clear all suggestions',
      icon: <ListX className="w-4 h-4" />,
      onClick: onClearAll,
    },
    {
      tooltip: isExpanded ? 'Collapse' : 'Expand',
      icon: isExpanded ? (
        <ChevronUp className="w-5 h-5" />
      ) : (
        <ChevronDown className="w-5 h-5" />
      ),
      onClick: onToggleExpanded,
    },
  ];

  return (
    <div className="flex gap-0.5">
      {actions.map((action, index) => {
        const button = (
          <button
            key={index}
            type="button"
            className={iconButtonClasses}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
          </button>
        );

        if (action.disabled) {
          return button;
        }

        return (
          <Tooltip key={index} title={action.tooltip}>
            {button}
          </Tooltip>
        );
      })}
    </div>
  );
};
