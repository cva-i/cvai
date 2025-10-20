import { useState, useCallback, useEffect, useOptimistic, useTransition } from 'react';
import type { Maybe } from '../generated/graphql';
import { tryCatch } from '../utils';

type UseEditableTypographyBaseProps = {
  value?: Maybe<string>;
  onSave: (newValue: string) => Promise<void>;
};

type UseEditableTypographyBaseReturn = {
  isEditing: boolean;
  startEditing: () => void;
  tempValue?: Maybe<string>;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
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
    setTempValue(value);
  }, [value]);

  const handleSave = useCallback(() => {
    if (!tempValue || tempValue === value) {
      setIsEditing(false);
      return;
    }

    setOptimisticValue(tempValue);
    setIsEditing(false);

    startTransition(async () => {
      const [, error] = await tryCatch(onSave(tempValue));
      if (error) {
        console.error('Failed to save:', error);
        // On error, the optimistic value will revert to the real value
      }
    });
  }, [tempValue, value, onSave, setOptimisticValue]);

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
