import React, { useCallback, useEffect, useRef } from 'react';
import { Box, styled } from '@mui/material';
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
    <SidebarContainer isExpanded={isExpanded}>
      {isExpanded ? (
        <ExpandedSidebar onCollapse={toggleSidebar} />
      ) : (
        <QuickActionsPanel onExpand={toggleSidebar} />
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled(Box)<{ isExpanded: boolean }>(
  ({ isExpanded }) => ({
    position: 'fixed',
    left: 16,
    top: 16,
    width: isExpanded ? EXPANDED_SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH,
    height: isExpanded ? '80vh' : '356px',
    maxHeight: '1200px',
    backgroundColor: '#FFFFFF',
    boxShadow: '-2px 2px 2px 2px rgba(0, 0, 0, 0.25)',
    borderRadius: '16px',
    zIndex: 1200,
    transition: 'width 0.3s ease, height 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isExpanded ? 'flex-start' : 'space-between',
    alignItems: isExpanded ? 'flex-start' : 'center',
    padding: '16px',
    gap: isExpanded ? '16px' : '56px',
  })
);
