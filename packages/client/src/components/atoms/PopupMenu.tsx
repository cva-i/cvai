import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu';
import { cn } from '@ui/lib/utils';

export type OptionsMenuProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  id: string;
  options: { label: string; action: (id: string) => void }[];
};

export const PopupMenu: React.FC<OptionsMenuProps> = ({
  options,
  id,
  className,
  ...props
}) => {
  const handleOptionClick = (action: (id: string) => void) => {
    action(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-lg h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            className
          )}
          aria-label="options"
          {...props}
        >
          <MoreVertical className="h-5 w-5 text-primary-dark" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleOptionClick(option.action)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
