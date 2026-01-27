import { cva } from 'class-variance-authority';

export const cardContainerVariants = cva(
  [
    'border-2 rounded-lg bg-white p-4',
    'flex flex-col gap-3',
    'transition-all duration-200 ease-out',
  ],
  {
    variants: {
      isActive: {
        true: 'border-violet-500',
        false: 'border-gray-100 hover:border-violet-500/20',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export const commentTextClasses =
  'text-sm leading-relaxed text-gray-700 mb-2';

export const previewLabelClasses =
  'text-xs font-semibold text-gray-500 mt-3 mb-1.5 uppercase tracking-wider';

export const previewTextClasses =
  'text-sm leading-relaxed text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 italic';
