import type { ReactNode } from 'react';

export interface BaseListItemProps {
  _id: string;
  selected?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

export interface BaseListProps<T extends { _id: string }> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  containerClassName?: string;
  listClassName?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  };
}

export interface StandardListItemProps<T> extends BaseListItemProps {
  item: T;
  primary: string | ReactNode;
  secondary?: string | ReactNode;
  actions?: ReactNode;
  highlight?: boolean;
}
