import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@ui/lib/utils';
import { usePreviewMode } from '../../contexts';
import { QuickActionsPanel } from './QuickActionsPanel';
import { ExpandedSidebar } from './ExpandedSidebar';

export const EXPANDED_SIDEBAR_WIDTH = 350;
export const COLLAPSED_SIDEBAR_WIDTH = 82;

type FloatingSidebarProps = {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
};

export const FloatingSidebar = ({
  isExpanded,
  onToggle,
}: FloatingSidebarProps) => {
  const { isPreviewing } = usePreviewMode();
  const savedState = useRef(isExpanded);

  const toggleSidebar = useCallback(() => {
    onToggle(!isExpanded);
  }, [isExpanded, onToggle]);

  // Auto-hide when previewing
  useEffect(
    () => {
      if (isPreviewing) {
        savedState.current = isExpanded;
        onToggle(false);
      } else {
        onToggle(savedState.current);
      }
    },
    // eslint-disable-next-line
    [isPreviewing, onToggle]
  );

  // Don't render anything when previewing
  if (isPreviewing) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-4 top-4 z-[1200] flex flex-col rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 ease-in-out',
        isExpanded
          ? 'h-[80vh] max-h-[1200px] w-[350px] items-start justify-start gap-4'
          : 'h-[356px] w-[82px] items-center justify-between gap-14'
      )}
    >
      {isExpanded ? (
        <ExpandedSidebar onCollapse={toggleSidebar} />
      ) : (
        <QuickActionsPanel onExpand={toggleSidebar} />
      )}
    </div>
  );
};
