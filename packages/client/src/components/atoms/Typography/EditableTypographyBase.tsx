import type { BoxProps, TextFieldProps, TypographyProps } from '@mui/material';
import { Box, TextField, Typography } from '@mui/material';
import { TypographyWithMarkdown } from './TypographyWithMarkdown';
import type { Maybe } from '../../../generated/graphql';
import { useRef, useEffect, useCallback } from 'react';
import { useEntryEdit } from '../../../contexts';

type EditableTypographyBaseProps = Pick<
  BoxProps,
  'onMouseUp' | 'onMouseDown' | 'onContextMenu' | 'sx'
> & {
  id: string;
  isEditing: boolean;
  setTempValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: (valueToSave?: string) => void;
  handleCancel: () => void;
  multiline?: boolean;
  variant?: TypographyProps['variant'];
  typographyProps?: TypographyProps;
  textFieldProps?: TextFieldProps;
  tempValue?: Maybe<string>;
  value?: Maybe<string>;
  valueRender?: (v?: Maybe<string>) => string;
  ref?: React.Ref<HTMLDivElement>;
  useContentEditable?: boolean;
};

export const EditableTypographyBase = ({
  id,
  isEditing,
  tempValue,
  setTempValue,
  handleSave,
  handleCancel,
  multiline = false,
  variant = 'body1',
  typographyProps,
  textFieldProps,
  value,
  onMouseUp,
  onMouseDown,
  onContextMenu,
  valueRender,
  sx,
  ref,
  useContentEditable = false,
}: EditableTypographyBaseProps) => {
  const commonStyles = {
    typography: variant,
    width: '100%',
  };

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const previouslyEditingRef = useRef(false);
  const { isEntryActive } = useEntryEdit();

  useEffect(function syncContentEditable() {
    if (useContentEditable && contentEditableRef.current) {
      const displayValue = valueRender?.(value) ?? value ?? '';
      const currentContent = contentEditableRef.current.textContent ?? '';

      if (currentContent !== displayValue && (!isEditing || document.activeElement !== contentEditableRef.current)) {
        contentEditableRef.current.textContent = displayValue;
      }
    }
  }, [value, isEditing, useContentEditable, valueRender]);

  useEffect(function saveOnEntryBlur() {
    if (previouslyEditingRef.current && !isEntryActive && contentEditableRef.current) {
      const currentContent = contentEditableRef.current.textContent ?? '';
      const originalValue = valueRender?.(value) ?? value ?? '';
      if (currentContent !== originalValue) {
        handleSave(currentContent);
      }
    }
    previouslyEditingRef.current = isEntryActive;
  }, [isEntryActive, value, valueRender, handleSave]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (contentEditableRef.current) {
        const currentContent = contentEditableRef.current.textContent ?? '';
        const originalValue = valueRender?.(value) ?? value ?? '';
        if (currentContent !== originalValue) {
          handleSave(currentContent);
        }
      }
    }, 1000);
  }, [value, valueRender, handleSave]);

  const handleContentEditableInput = useCallback(() => {
    if (multiline) {
      debouncedSave();
    }
  }, [multiline, debouncedSave]);

  const handleContentEditableBlur = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (contentEditableRef.current) {
      const currentContent = contentEditableRef.current.textContent ?? '';
      const originalValue = valueRender?.(value) ?? value ?? '';
      if (currentContent !== originalValue) {
        handleSave(currentContent);
      }
    }
  }, [value, valueRender, handleSave]);

  const handleContentEditableKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (contentEditableRef.current) {
        const currentContent = contentEditableRef.current.textContent ?? '';
        handleSave(currentContent);
        contentEditableRef.current.blur();
      }
    } else if (e.key === 'Escape') {
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
  }, [multiline, value, valueRender, handleSave, handleCancel]);

  return (
    <Box
      id={id}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
      ref={ref}
      sx={{
        ...sx,
      }}
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
          sx={{
            ...(typographyProps?.sx ?? {}),
            ...commonStyles,
            outline: 'none',
            cursor: 'text',
            minHeight: '1em',
          }}
        >
          {valueRender?.(value) ?? value}
        </Typography>
      ) : isEditing ? (
        <TextField
          autoFocus
          {...textFieldProps}
          value={tempValue ?? ''}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          fullWidth
          multiline={multiline}
          variant="standard"
          size="small"
          sx={{
            ...commonStyles,
            ...(textFieldProps?.sx ?? {}),
          }}
          InputProps={{
            sx: {
              ...commonStyles,
              borderRadius: 0,
              margin: 0,
              ...(textFieldProps?.InputProps?.sx ?? {}),
            },
          }}
        />
      ) : (
        <TypographyWithMarkdown
          variant={variant}
          sx={{
            ...(typographyProps?.sx ?? {}),
            ...commonStyles,
            ...(!value
              ? {
                  color: 'black',
                  opacity: '0.3',
                }
              : {}),
          }}
        >
          {valueRender?.(value) ?? value}
        </TypographyWithMarkdown>
      )}
    </Box>
  );
};
