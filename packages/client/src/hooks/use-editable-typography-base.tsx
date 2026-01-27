import {
  useState,
  useCallback,
  useEffect,
  useOptimistic,
  useTransition,
} from 'react';
import type { Maybe } from '../generated/graphql';
import { tryCatch } from '../utils';

type UseEditableTypographyBaseProps = {
  value?: Maybe<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (newValue: string) => Promise<any>;
};

type UseEditableTypographyBaseReturn = {
  isEditing: boolean;
  startEditing: () => void;
  tempValue?: Maybe<string>;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: (valueToSave?: string) => void;
  handleCancel: () => void;
  isPending: boolean;
  displayValue: string | null | undefined;
};

type NonNullableSetStateAction<T> =
  T extends React.Dispatch<React.SetStateAction<infer S>>
    ? React.Dispatch<React.SetStateAction<NonNullable<S>>>
    : T;

export const useEditableTypographyBase = ({
  value,
  onSave,
}: UseEditableTypographyBaseProps): UseEditableTypographyBaseReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    value,
    (_, newValue: string) => newValue
  );

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value);
    }
  }, [value, isEditing]);

  const handleSave = useCallback(
    (valueToSave?: string) => {
      const newValue = valueToSave ?? tempValue;

      if (newValue == null || newValue === value) {
        setIsEditing(false);
        return;
      }

      setTempValue(newValue);
      setIsEditing(false);

      startTransition(async () => {
        setOptimisticValue(newValue);
        const [, error] = await tryCatch(onSave(newValue));
        if (error) {
          console.error('Failed to save:', error);
        }
      });
    },
    [tempValue, value, onSave, setOptimisticValue]
  );

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  return {
    isEditing,
    startEditing,
    tempValue,
    setTempValue: setTempValue as NonNullableSetStateAction<
      typeof setTempValue
    >,
    handleSave,
    handleCancel,
    isPending,
    displayValue: optimisticValue,
  };
};
