import type { ReactNode } from 'react';
import React from 'react';
import { cn } from '@ui/lib/utils';
import { EntryEditContext } from '../../../contexts';
import { useEditableSection } from '../../../hooks';

interface WithEditableSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  renderActions?: (isActive: boolean) => ReactNode;
  flexDirection?: 'row' | 'column';
  height?: string | number;
}

export function WithEditableSection({
  children,
  renderActions,
  flexDirection = 'row',
  height,
  className,
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
    getContainerClassName,
  } = useEditableSection();

  if (isPreviewing) {
    return <div>{children}</div>;
  }

  const flexDirectionClass = flexDirection === 'column' ? 'flex-col' : 'flex-row';

  return (
    <EntryEditContext.Provider value={contextValue}>
      {/* Backdrop */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black/30 z-[1300]"
          onClick={deactivate}
        />
      )}
      <div
        className={cn(
          'flex justify-start items-start',
          flexDirectionClass,
          getContainerClassName(),
          className
        )}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {renderActions?.(isActive)}
        {children}
      </div>
    </EntryEditContext.Provider>
  );
}
