import { useMemo } from 'react';
import { Undo, Redo } from 'lucide-react';
import {
  refetchGetVersioningActionsMetadataQuery,
  useGetVersioningActionsMetadataQuery,
  useRedoCvVersionMutation,
  useUndoCvVersionMutation,
} from '../../generated/graphql';
import { toast } from 'react-toastify';
import { useCurrentCv, usePreviewMode } from '../../contexts';
import { IconButton } from '../atoms';
import { VersionHistoryButton } from './VersionHistoryButton';

const VersionControlButtonsInner = ({ cvId }: { cvId: string }) => {
  const {
    data: {
      getVersioningActionsMetadata: { canUndo = false, canRedo = false } = {},
    } = {},
  } = useGetVersioningActionsMetadataQuery({
    variables: { cvId },
  });

  const { isPreviewing } = usePreviewMode();

  const refetchUndoRedoQueries = useMemo(
    () => [refetchGetVersioningActionsMetadataQuery({ cvId })],
    [cvId]
  );

  const [undoVersion, { loading: undoLoading }] = useUndoCvVersionMutation({
    onError: (err) => toast.error(`Failed to undo: ${err.message}`),
    refetchQueries: refetchUndoRedoQueries,
  });

  const [redoVersion, { loading: redoLoading }] = useRedoCvVersionMutation({
    onError: (err) => toast.error(`Failed to redo: ${err.message}`),
    refetchQueries: refetchUndoRedoQueries,
  });

  // Fixed: Moved early return after all hooks to comply with Rules of Hooks
  if (isPreviewing) return null;

  return (
    <div className="flex gap-1">
      <IconButton
        title="Undo"
        onClick={() => undoVersion({ variables: { cvId } })}
        disabled={!canUndo || undoLoading}
      >
        <Undo />
      </IconButton>

      <IconButton
        title="Redo"
        onClick={() => redoVersion({ variables: { cvId } })}
        disabled={!canRedo || redoLoading}
      >
        <Redo />
      </IconButton>

      <VersionHistoryButton />
    </div>
  );
};

export const VersionControlButtons = () => {
  const { currentCvId } = useCurrentCv();

  // Fixed: All hooks called, then conditional render - complies with Rules of Hooks
  if (!currentCvId) return null;
  return <VersionControlButtonsInner cvId={currentCvId} />;
};
