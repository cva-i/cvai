import type { ReactNode } from 'react';
import React from 'react';
import type { BoxProps } from '@mui/material';
import { Backdrop, Box } from '@mui/material';
import { EntryEditContext } from '../../../contexts';
import { useEditableSection } from '../../../hooks';

type WithEditableSectionProps = React.PropsWithChildren<{
  renderActions?: (isActive: boolean) => ReactNode;
  flexDirection?: BoxProps['flexDirection'];
  height?: BoxProps['height'];
}> &
  Omit<
    BoxProps,
    'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'flexDirection' | 'height'
  >;

export function WithEditableSection({
  children,
  renderActions,
  flexDirection = 'row',
  height,
  ...props
}: WithEditableSectionProps) {
  const {
    isActive,
    isPreviewing,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    deactivate,
    contextValue,
    containerStyles,
  } = useEditableSection();

  if (isPreviewing) {
    return <Box>{children}</Box>;
  }

  return (
    <EntryEditContext.Provider value={contextValue}>
      <Backdrop
        open={isActive}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        onClick={deactivate}
      />
      <Box
        display="flex"
        justifyContent="start"
        flexDirection={flexDirection}
        height={height}
        alignItems="flex-start"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        sx={containerStyles}
        {...props}
      >
        {renderActions?.(isActive)}
        {children}
      </Box>
    </EntryEditContext.Provider>
  );
}
