import { Typography } from '../atoms/Typography/Typography';
import type { FieldChange } from './types';

type FieldChangeDisplayProps = {
  field: FieldChange;
};

export const FieldChangeDisplay = ({ field }: FieldChangeDisplayProps) => {
  const renderContent = () => {
    switch (field.action) {
      case 'added': {
        return (
          <div className="pl-4 border-l-2 border-green-500">
            <Typography className="text-green-600">
              {field.newValue ?? '(empty)'}
            </Typography>
          </div>
        );
      }
      case 'removed': {
        return (
          <div className="pl-4 border-l-2 border-red-500">
            <Typography className="text-red-600 line-through">
              {field.oldValue ?? '(empty)'}
            </Typography>
          </div>
        );
      }
      case 'changed': {
        return (
          <div className="pl-4 border-l-2 border-amber-500">
            <Typography className="text-muted-foreground line-through">
              {field.oldValue ?? '(empty)'}
            </Typography>
            <Typography className="text-amber-700">
              {field.newValue ?? '(empty)'}
            </Typography>
          </div>
        );
      }
    }
  };

  return (
    <div className="mb-2">
      <Typography variant="subtitle2">{field.label}</Typography>
      {renderContent()}
    </div>
  );
};
