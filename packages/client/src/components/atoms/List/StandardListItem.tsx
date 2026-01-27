import type { StandardListItemProps } from './types';
import { cn } from '@ui/lib/utils';

export function StandardListItem<T>({
  _id,
  primary,
  secondary,
  actions,
  selected,
  onClick,
  highlight,
  className,
}: StandardListItemProps<T>) {
  const handleClick = () => {
    if (onClick) onClick(_id);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'flex flex-row rounded p-2 px-4',
        highlight && 'bg-blue-500/8',
        selected && 'bg-primary-light text-primary-foreground',
        onClick && 'cursor-pointer hover:bg-blue-500/5',
        !onClick && 'cursor-default',
        className
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm truncate">{primary}</span>
        {secondary && (
          <span className="text-xs text-muted-foreground truncate">
            {secondary}
          </span>
        )}
      </div>

      {actions && <div className="flex-shrink-0 ml-2">{actions}</div>}
    </div>
  );
}
