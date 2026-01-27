import { cn } from '@ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const emptyLabelVariants = cva('italic text-muted-foreground', {
  variants: {
    size: {
      default: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type EmptyLabelProps = VariantProps<typeof emptyLabelVariants> & {
  className?: string;
  onClick?: () => void;
};

export const EmptyLabel = ({ size, className, onClick }: EmptyLabelProps) => {
  return (
    <span
      className={cn(
        emptyLabelVariants({ size }),
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      (empty)
    </span>
  );
};
