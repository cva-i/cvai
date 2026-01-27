import React from 'react';
import { Minus } from 'lucide-react';
import { IconButton } from './IconButton';

interface RemoveEntryButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const RemoveEntryButton = ({ onClick }: RemoveEntryButtonProps) => {
  return (
    <IconButton
      title="Remove entry"
      onClick={onClick}
      variant="destructive"
      className="h-full rounded-lg flex flex-col justify-start items-start content-center"
    >
      <Minus className="text-destructive" />
    </IconButton>
  );
};
