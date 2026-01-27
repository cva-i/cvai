import React, { useCallback, useState } from 'react';
import type { CvVersionHistoryEntryObjectType } from '../../../generated/graphql';
import {
  useCreateCvFromVersionMutation,
  useGetCvVersionHistoryQuery,
} from '../../../generated/graphql';
import { toast } from 'react-toastify';
import { Typography } from '../../atoms';
import { BaseList, ListContainer } from '../../atoms/List';
import { VersionHistoryItem } from './VersionHistoryItem';
import { VersionComparisonDialog } from './VersionComparisonDialog';
import { Popover, PopoverContent, PopoverAnchor } from '../../ui/popover';

interface VersionHistoryPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  cvId: string;
}

const VersionHistoryHeader = () => (
  <Typography variant="subtitle1" className="font-bold mb-1 px-1">
    Version History
  </Typography>
);

export const VersionHistoryPopover: React.FC<VersionHistoryPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  cvId,
}) => {
  // TODO: there should be a version comparison dialog showing the changes
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  const { loading, error, data } = useGetCvVersionHistoryQuery({
    variables: { cvId },
  });

  const [createCvFromVersion] = useCreateCvFromVersionMutation({
    onCompleted: (data) => {
      toast.success(
        `New CV created from version: ${data.createCvFromVersion.title}`
      );
      onClose();
    },
    onError: (err) => toast.error(`Failed to create CV: ${err.message}`),
    refetchQueries: ['GetCvs'],
  });

  const handleCompareClick = useCallback((versionId: string) => {
    setSelectedVersionId(versionId);
    setCompareDialogOpen(true);
  }, []);

  const handleCreateFromClick = useCallback(
    (versionId: string) => {
      createCvFromVersion({
        variables: {
          cvId,
          versionId,
        },
      });
    },
    [createCvFromVersion, cvId]
  );

  const handleCloseCompareDialog = () => {
    setCompareDialogOpen(false);
    setSelectedVersionId(null);
  };

  const renderVersionItem = useCallback(
    (version: CvVersionHistoryEntryObjectType) => (
      <VersionHistoryItem
        version={version}
        onCompareClick={handleCompareClick}
        onCreateFromClick={handleCreateFromClick}
      />
    ),
    [handleCompareClick, handleCreateFromClick]
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        {anchorEl && <PopoverAnchor virtualRef={{ current: anchorEl }} />}
        <PopoverContent
          align="center"
          side="bottom"
          className="flex flex-col w-80 p-2 bg-background-paper/90 backdrop-blur-sm"
        >
          <ListContainer headerComponent={<VersionHistoryHeader />}>
            <BaseList
              items={data?.getCvVersionHistory?.items ?? []}
              renderItem={renderVersionItem}
              loading={loading}
              error={error}
              emptyMessage="No version history available"
            />
          </ListContainer>
        </PopoverContent>
      </Popover>

      {selectedVersionId && (
        <VersionComparisonDialog
          open={compareDialogOpen}
          onClose={handleCloseCompareDialog}
          versionId={selectedVersionId}
          cvId={cvId}
        />
      )}
    </>
  );
};
