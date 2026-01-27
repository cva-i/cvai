import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@ui/lib/utils';

interface ApplyButtonProps {
  loading: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({
  loading,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex items-center justify-center gap-1.5',
        'cursor-pointer text-sm font-semibold text-white',
        'bg-violet-500 hover:bg-violet-600',
        'transition-colors duration-200',
        'px-4 py-2 rounded-lg mt-2',
        'disabled:bg-gray-300 disabled:cursor-not-allowed',
        '[&_svg]:w-[18px] [&_svg]:h-[18px]'
      )}
    >
      <Check />
      <span>{loading ? 'Applying...' : 'Apply Change'}</span>
    </button>
  );
};
