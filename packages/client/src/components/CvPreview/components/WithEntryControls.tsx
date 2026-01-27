import React from 'react';
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { IconButton } from '../../atoms/IconButton';
import { WithEditableSection } from './WithEditableSection';

interface EntryData {
  positionIndex: number;
  [key: string]: unknown;
}

interface WithEntryControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  removeEntry: () => void;
  onAddEntry?: (entryData?: Partial<EntryData>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  currentEntry?: EntryData;
  flexDirection?: 'row' | 'column';
  height?: string | number;
}

export const WithEntryControls = ({
  children,
  removeEntry,
  onAddEntry,
  onMoveUp,
  onMoveDown,
  currentEntry,
  flexDirection = 'row',
  height,
  className,
  ...props
}: WithEntryControlsProps) => {
  return (
    <WithEditableSection
      flexDirection={flexDirection}
      height={height}
      className={className}
      renderActions={(isActive) =>
        isActive ? (
          <div
            className={cn(
              'absolute -top-10 left-1/2 -translate-x-1/2',
              'flex gap-1',
              'bg-background rounded shadow-md p-1'
            )}
          >
            <IconButton
              size="sm"
              title="Delete entry"
              onClick={(e) => {
                e.stopPropagation();
                removeEntry();
              }}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="sm"
              title="Move up"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              disabled={!onMoveUp}
            >
              <ArrowUp className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="sm"
              title="Move down"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              disabled={!onMoveDown}
            >
              <ArrowDown className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="sm"
              title="Add entry"
              onClick={(e) => {
                e.stopPropagation();
                if (currentEntry) {
                  onAddEntry?.({
                    positionIndex: currentEntry.positionIndex + 1,
                  });
                } else {
                  onAddEntry?.();
                }
              }}
              disabled={!onAddEntry}
              className="text-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </IconButton>
          </div>
        ) : null
      }
      {...props}
    >
      {children}
    </WithEditableSection>
  );
};
