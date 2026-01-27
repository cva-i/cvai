import type { Maybe } from '../../../generated/graphql';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'overline';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'error' | 'inherit';
  component?: React.ElementType;
}

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  autoFocus?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  InputProps?: {
    className?: string;
    style?: React.CSSProperties;
  };
}

export type EditableTypographyProps = TypographyProps & {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (newValue: string) => Promise<any>;
  onAiEdit?: (prompt: string) => void;
  multiline?: boolean;
  isEditing?: boolean;
  value?: Maybe<string>;
  textFieldProps?: TextFieldProps;
  valueRender?: (v?: Maybe<string>) => string;
  className?: string;
};
