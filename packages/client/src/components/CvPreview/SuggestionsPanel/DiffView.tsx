import { cn } from '@ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const diffRowVariants = cva(
  'flex items-start gap-2 px-3 py-2 text-sm leading-relaxed',
  {
    variants: {
      variant: {
        old: 'bg-red-50',
        new: 'bg-green-50',
      },
    },
  }
);

const diffMarkerVariants = cva('text-sm font-semibold min-w-4 font-mono', {
  variants: {
    variant: {
      old: 'text-red-700',
      new: 'text-green-700',
    },
  },
});

const diffTextVariants = cva('text-sm leading-relaxed flex-1 break-words', {
  variants: {
    variant: {
      old: 'text-red-900',
      new: 'text-green-900',
    },
  },
});

interface DiffRowProps extends VariantProps<typeof diffRowVariants> {
  marker: string;
  text: string;
}

function DiffRow({ variant, marker, text }: DiffRowProps) {
  return (
    <div className={diffRowVariants({ variant })}>
      <span className={diffMarkerVariants({ variant })}>{marker}</span>
      <span className={diffTextVariants({ variant })}>{text}</span>
    </div>
  );
}

interface DiffViewProps {
  oldText: string;
  newText: string;
  className?: string;
}

export function DiffView({ oldText, newText, className }: DiffViewProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-md overflow-hidden border border-gray-200',
        className
      )}
    >
      <DiffRow variant="old" marker="-" text={oldText} />
      <DiffRow variant="new" marker="+" text={newText} />
    </div>
  );
}
