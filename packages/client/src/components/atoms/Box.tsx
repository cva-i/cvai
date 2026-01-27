import React from 'react';
import { cn } from '@ui/lib/utils';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  display?: 'flex' | 'block' | 'inline' | 'inline-flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'between'
    | 'around'
    | 'evenly';
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: number;
  flex?: number | string;
  height?: string | number;
  width?: string | number;
  my?: number;
  mx?: number;
  p?: number;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      style,
      display,
      flexDirection,
      justifyContent,
      alignItems,
      gap,
      flex,
      height,
      width,
      my,
      mx,
      p,
      children,
      ...props
    },
    ref
  ) => {
    const displayClasses: Record<string, string> = {
      flex: 'flex',
      block: 'block',
      inline: 'inline',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      none: 'hidden',
    };

    const flexDirClasses: Record<string, string> = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };

    const justifyClasses: Record<string, string> = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const alignClasses: Record<string, string> = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    };

    const styleObj: React.CSSProperties = { ...style };
    if (height !== undefined)
      styleObj.height = typeof height === 'number' ? `${height}px` : height;
    if (width !== undefined)
      styleObj.width = typeof width === 'number' ? `${width}px` : width;
    if (gap !== undefined) styleObj.gap = `${gap * 4}px`;
    if (flex !== undefined) styleObj.flex = flex;
    if (my !== undefined) {
      styleObj.marginTop = `${my * 4}px`;
      styleObj.marginBottom = `${my * 4}px`;
    }
    if (mx !== undefined) {
      styleObj.marginLeft = `${mx * 4}px`;
      styleObj.marginRight = `${mx * 4}px`;
    }
    if (p !== undefined) styleObj.padding = `${p * 4}px`;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-auto scrollbar-none',
          display && displayClasses[display],
          flexDirection && flexDirClasses[flexDirection],
          justifyContent && justifyClasses[justifyContent],
          alignItems && alignClasses[alignItems],
          className
        )}
        style={styleObj}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Box.displayName = 'Box';

export const CenteredBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-center h-full overflow-auto scrollbar-none',
      className
    )}
    {...props}
  />
));

CenteredBox.displayName = 'CenteredBox';

export const RowLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-row overflow-auto scrollbar-none', className)}
    {...props}
  />
));

RowLayout.displayName = 'RowLayout';

export const ColumnLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col overflow-auto scrollbar-none', className)}
    {...props}
  />
));

ColumnLayout.displayName = 'ColumnLayout';
