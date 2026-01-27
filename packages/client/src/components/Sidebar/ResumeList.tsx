import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { Typography } from '../atoms/Typography/Typography';
import {
  useGetCvsQuery,
  useDeleteCvMutation,
  refetchGetCvsQuery,
} from '../../generated/graphql';
import { useCurrentCv } from '../../contexts';
import { ResumeListItem } from './ResumeListItem';
import { DeleteConfirmationDialog } from '../WithActionsMenu/DeleteConfirmationDialog';

export const ResumeList = () => {
  const {
    data: cvQueryData,
    loading: cvQueryLoading,
    error: cvsQueryError,
  } = useGetCvsQuery();

  const [deleteCv] = useDeleteCvMutation({
    refetchQueries: [refetchGetCvsQuery()],
  });
  const { setCurrentCvId } = useCurrentCv();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = useMemo(
    () => (cvQueryLoading ? [] : (cvQueryData?.getCvs ?? [])),
    [cvQueryData, cvQueryLoading]
  );

  useEffect(() => {
    setCurrentCvId((currentCvId) =>
      !items.length || items.find((it) => it._id === currentCvId)
        ? currentCvId
        : null
    );
  }, [setCurrentCvId, items]);

  const handleDelete = useCallback((id: string) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedItemId) {
      return;
    }

    void deleteCv({
      variables: { cvId: selectedItemId },
    });
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  }, [deleteCv, selectedItemId]);

  if (cvsQueryError) {
    return (
      <div className="p-4">
        <Typography color="error">Failed to load resumes</Typography>
      </div>
    );
  }

  if (cvQueryLoading) {
    return (
      <div className="p-4">
        <Typography color="secondary">Loading...</Typography>
      </div>
    );
  }

  return (
    <>
      {/* List Header */}
      <div className="mt-4 shrink-0 border-t border-border pb-2 pt-4">
        <Typography variant="overline" color="secondary">
          Resumes
        </Typography>
      </div>

      {/* List Scroll Container */}
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Typography variant="body2" color="secondary">
              No resumes yet. Create your first one!
            </Typography>
          </div>
        ) : (
          items.map((item) => (
            <ResumeListItem
              key={item._id}
              id={item._id}
              name={item.name}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollArea>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        }}
      />
    </>
  );
};
