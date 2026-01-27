import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@ui/lib/utils';
import { Tooltip } from '../Tooltip';
import { Typography, type TypographyProps } from './Typography';

interface TypographyWithOverflowProps extends TypographyProps {
  disableTooltip?: boolean;
}

export const TypographyWithOverflow = ({
  children,
  disableTooltip,
  className,
  ...props
}: TypographyWithOverflowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const component = useMemo(
    () => (
      <Typography
        {...props}
        ref={ref}
        className={cn('whitespace-nowrap overflow-hidden text-ellipsis', className)}
        key="styledTypographyKey"
      >
        {children}
      </Typography>
    ),
    [props, children, className]
  );

  useEffect(() => {
    const hasOverflow =
      !!ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setIsOverflow(hasOverflow);
  }, [children]);

  const renderTooltip =
    !disableTooltip && isOverflow && typeof children === 'string';

  return renderTooltip ? (
    <Tooltip title={children}>{component}</Tooltip>
  ) : (
    component
  );
};
