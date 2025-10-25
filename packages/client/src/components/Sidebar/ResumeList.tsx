import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
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
    if (!selectedItemId) return;

    void deleteCv({
      variables: { cvId: selectedItemId },
    });
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  }, [deleteCv, selectedItemId]);

  if (cvsQueryError) {
    return (
      <ErrorContainer>
        <Typography color="error">Failed to load resumes</Typography>
      </ErrorContainer>
    );
  }

  if (cvQueryLoading) {
    return (
      <LoadingContainer>
        <Typography color="text.secondary">Loading...</Typography>
      </LoadingContainer>
    );
  }

  return (
    <>
      <ListHeader>
        <Typography variant="overline" color="text.secondary">
          Resumes
        </Typography>
      </ListHeader>

      <ListScrollContainer>
        {items.length === 0 ? (
          <EmptyState>
            <Typography variant="body2" color="text.secondary">
              No resumes yet. Create your first one!
            </Typography>
          </EmptyState>
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
      </ListScrollContainer>

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

const ListHeader = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

const ListScrollContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
});

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  textAlign: 'center',
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));
