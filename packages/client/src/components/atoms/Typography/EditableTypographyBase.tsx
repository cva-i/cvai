import { useRef, useEffect, useCallback } from 'react';
import { TypographyWithMarkdown } from './TypographyWithMarkdown';
import { Typography, type TypographyProps } from './Typography';
import type { Maybe } from '../../../generated/graphql';
import { useEntryEdit } from '../../../contexts';
import { cn } from '@ui/lib/utils';
import { Input } from '@ui/components/ui/input';
import { Textarea } from '@ui/components/ui/textarea';
import type { TypographyVariant, TextFieldProps } from './types';

type EditableTypographyBaseProps = {
  id: string;
  isEditing: boolean;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: (valueToSave?: string) => void;
  handleCancel: () => void;
  startEditing?: () => void;
  multiline?: boolean;
  variant?: TypographyVariant;
  typographyProps?: TypographyProps;
  textFieldProps?: TextFieldProps;
  tempValue?: Maybe<string>;
  value?: Maybe<string>;
  valueRender?: (v?: Maybe<string>) => string;
  ref?: React.Ref<HTMLDivElement>;
  useContentEditable?: boolean;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

export const EditableTypographyBase = ({
  id,
  isEditing,
  tempValue,
  setTempValue,
  handleSave,
  handleCancel,
  startEditing,
  multiline = false,
  variant = 'body1',
  typographyProps,
  textFieldProps,
  value,
  onMouseUp,
  onMouseDown,
  onContextMenu,
  valueRender,
  className,
  ref,
  useContentEditable = false,
}: EditableTypographyBaseProps) => {
  const variantToSize: Record<string, string> = {
    h1: 'text-3xl font-semibold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-semibold',
    h4: 'text-base font-semibold',
    h5: 'text-sm font-semibold',
    h6: 'text-xs font-semibold',
    body1: 'text-sm',
    body2: 'text-xs',
    subtitle1: 'text-sm',
    subtitle2: 'text-xs',
    caption: 'text-xs',
    overline: 'text-xs uppercase tracking-wider',
  };

  const commonClasses = cn(variantToSize[variant], 'w-full');

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const previouslyEditingRef = useRef(false);
  const { isEntryActive, deactivate } = useEntryEdit();

  useEffect(
    function syncContentEditable() {
      if (useContentEditable && contentEditableRef.current) {
        const displayValue = valueRender?.(value) ?? value ?? '';
        const currentContent = contentEditableRef.current.textContent ?? '';

        if (
          currentContent !== displayValue &&
          !isEntryActive &&
          (!isEditing || document.activeElement !== contentEditableRef.current)
        ) {
          contentEditableRef.current.textContent = displayValue;
        }
      }
    },
    [value, isEditing, isEntryActive, useContentEditable, valueRender]
  );

  useEffect(
    function saveOnEntryBlur() {
      if (
        previouslyEditingRef.current &&
        !isEntryActive &&
        contentEditableRef.current
      ) {
        const currentContent = contentEditableRef.current.textContent ?? '';
        const originalValue = valueRender?.(value) ?? value ?? '';
        if (currentContent !== originalValue) {
          handleSave(currentContent);
        }
      }
      previouslyEditingRef.current = isEntryActive;
    },
    [isEntryActive, value, valueRender, handleSave]
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleContentEditableInput = useCallback(() => {
    // Do nothing - we'll save only when section becomes inactive
  }, []);

  const handleContentEditableBlur = useCallback(() => {
    // Do nothing - we'll save only when section becomes inactive
  }, []);

  const handleContentEditableKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && !multiline) {
        // For single-line fields: Save on Enter
        e.preventDefault();
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        if (contentEditableRef.current) {
          const currentContent = contentEditableRef.current.textContent ?? '';
          handleSave(currentContent);
          contentEditableRef.current.blur();
        }
        deactivate?.();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        // Cmd+Enter: Save and deactivate (for multiline fields)
        e.preventDefault();
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        if (contentEditableRef.current) {
          const currentContent = contentEditableRef.current.textContent ?? '';
          handleSave(currentContent);
          contentEditableRef.current.blur();
        }
        deactivate?.();
      } else if (e.key === 'Escape') {
        // Escape: Cancel and revert changes
        e.preventDefault();
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        handleCancel();
        if (contentEditableRef.current) {
          const displayValue = valueRender?.(value) ?? value ?? '';
          contentEditableRef.current.textContent = displayValue;
          contentEditableRef.current.blur();
        }
      }
    },
    [multiline, value, valueRender, handleSave, handleCancel, deactivate]
  );

  const inputProps = {
    autoFocus: true,
    value: tempValue ?? '',
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setTempValue(e.target.value),
    onKeyDown: (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
        // Save on Enter for single-line fields, or Cmd/Ctrl+Enter for multiline
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    },
    className: cn(
      commonClasses,
      'bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 px-0',
      textFieldProps?.className
    ),
    disabled: textFieldProps?.disabled,
  };

  return (
    <div
      id={id}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      ref={ref}
      className={className}
    >
      {isEditing && useContentEditable ? (
        <Typography
          {...typographyProps}
          variant={variant}
          contentEditable={true}
          suppressContentEditableWarning
          onInput={handleContentEditableInput}
          onBlur={handleContentEditableBlur}
          onKeyDown={handleContentEditableKeyDown}
          ref={contentEditableRef}
          className={cn(
            typographyProps?.className,
            commonClasses,
            'outline-none cursor-text min-h-[1em]'
          )}
        >
          {valueRender?.(value) ?? value}
        </Typography>
      ) : isEditing ? (
        multiline ? (
          <Textarea {...inputProps} />
        ) : (
          <Input {...inputProps} />
        )
      ) : (
        <TypographyWithMarkdown
          variant={variant}
          className={cn(
            typographyProps?.className,
            commonClasses,
            !value && 'text-black/30',
            startEditing && 'cursor-pointer hover:bg-black/5 rounded px-1 -mx-1'
          )}
          onClick={startEditing}
        >
          {valueRender?.(value) ?? value}
        </TypographyWithMarkdown>
      )}
    </div>
  );
};
