import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@ui/lib/utils';

const actionButtonClasses = cn(
  'flex items-center gap-1.5 cursor-pointer',
  'text-sm font-medium text-gray-500',
  'transition-colors duration-200',
  'p-1.5 rounded-lg',
  'hover:text-gray-900 hover:bg-gray-100',
  '[&_svg]:w-[18px] [&_svg]:h-[18px]'
);

interface CardHeaderProps {
  onResolve: () => void;
  onReject: () => void;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  onResolve,
  onReject,
}) => {
  return (
    <div className="flex gap-4 pb-3 border-b border-gray-200">
      <button
        type="button"
        className={actionButtonClasses}
        onClick={(e) => {
          e.stopPropagation();
          onResolve();
        }}
      >
        <Check />
        <span>Resolve</span>
      </button>
      <button
        type="button"
        className={actionButtonClasses}
        onClick={(e) => {
          e.stopPropagation();
          onReject();
        }}
      >
        <X />
        <span>Reject</span>
      </button>
    </div>
  );
};
