import { Fragment } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BaseListProps } from './types';
import { cn } from '@ui/lib/utils';
import { Button } from '@ui/components/ui/button';

export function BaseList<T extends { _id: string }>({
  items,
  renderItem,
  loading,
  error,
  emptyMessage = 'No items available',
  containerClassName,
  listClassName,
  pagination,
}: BaseListProps<T>) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-destructive text-sm p-4">Error: {error.message}</p>
      );
    }

    if (!items || items.length === 0) {
      return <p className="text-sm text-muted-foreground p-4">{emptyMessage}</p>;
    }

    return (
      <ul className={cn('w-full space-y-0.5', listClassName)}>
        {items.map((item, index) => (
          <Fragment key={item._id}>{renderItem(item, index)}</Fragment>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full overflow-auto scrollbar-none',
        containerClassName
      )}
    >
      <div
        className={cn('flex-1 overflow-y-auto min-h-0', pagination && 'pb-4')}
      >
        {renderContent()}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="sticky bottom-0 w-fit self-center rounded-full p-0.5 bg-background-paper flex justify-center z-10 border border-border">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) =>
                pagination.onChange(
                  e as unknown as React.ChangeEvent<unknown>,
                  Math.max(1, pagination.page - 1)
                )
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) =>
                pagination.onChange(
                  e as unknown as React.ChangeEvent<unknown>,
                  Math.min(pagination.totalPages, pagination.page + 1)
                )
              }
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
