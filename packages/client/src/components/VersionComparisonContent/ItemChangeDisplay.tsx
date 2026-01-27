import { cn } from '@ui/lib/utils';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Typography } from '../atoms/Typography/Typography';
import { FieldChangeDisplay } from './FieldChangeDisplay';
import type { ItemChange } from './types';
import { getActionBadgeClassName } from './utils';

type ItemChangeDisplayProps = {
  item: ItemChange;
  isLast: boolean;
};

export const ItemChangeDisplay = ({ item, isLast }: ItemChangeDisplayProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Typography variant="subtitle1" className="font-bold">
          {item.name}
        </Typography>
        <Badge
          variant="outline"
          className={cn('capitalize', getActionBadgeClassName(item.action))}
        >
          {item.action}
        </Badge>
      </div>

      {item.fields.map((field, idx) => (
        <FieldChangeDisplay key={`${field.label}-${idx}`} field={field} />
      ))}

      {!isLast && <Separator className="my-2" />}
    </div>
  );
};
