import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { Typography } from '../../../atoms/Typography/Typography';
import { IconButton } from '../../../atoms/IconButton';
import type { CvEntryItem } from '../../CvVisualizer/types';
import { usePreviewMode } from '../../../../contexts';

interface GenericEntriesSectionProps<TEntry extends CvEntryItem> {
  title?: string;
  loading: boolean;
  entries: TEntry[];
  noEntriesText: string;
  renderEntry: (entry: TEntry, index: number) => React.ReactNode;
  onAdd?: () => void;
  titleClassName?: string;
  flexDirection?: 'row' | 'column';
  className?: string;
  gap?: number | string;
}

export function GenericEntriesSection<TEntry extends CvEntryItem>({
  title,
  loading,
  entries,
  noEntriesText,
  renderEntry,
  onAdd,
  titleClassName,
  flexDirection = 'column',
  className,
  gap,
}: GenericEntriesSectionProps<TEntry>) {
  const { isPreviewing } = usePreviewMode();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const flexDirectionClass = flexDirection === 'column' ? 'flex-col' : 'flex-row';
  const gapStyle = gap !== undefined
    ? { gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap }
    : {};

  return (
    <div className={className}>
      {title && (
        <Typography
          variant="h4"
          className={cn('mb-2', titleClassName)}
        >
          {title}
        </Typography>
      )}

      <div
        className={cn('flex flex-wrap', flexDirectionClass)}
        style={gapStyle}
      >
        {entries.map((entry, index) => renderEntry(entry, index))}
        {!entries.length && (
          <div className="flex items-center gap-1 w-full">
            <Typography color="secondary">{noEntriesText}</Typography>
            {!isPreviewing && onAdd && (
              <IconButton
                title="Add entry"
                onClick={onAdd}
                size="sm"
                className="text-primary-dark hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
