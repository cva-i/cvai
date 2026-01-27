import { useState, useCallback } from 'react';
import { MoreHorizontal, Trash2, Pencil, Copy, FileText } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu';
import { Typography } from '../atoms/Typography/Typography';
import { IconButton } from '../atoms/IconButton';
import { useCurrentCv, useCvCreationFlow, useDialog } from '../../contexts';
import {
  useUpdateCvMutation,
  useDuplicateCvMutation,
  refetchGetCvsQuery,
} from '../../generated/graphql';
import { RenameDialog } from '../RenameDialog';

type ResumeListItemProps = {
  id: string;
  name: string;
  onDelete: (id: string) => void;
};

export const ResumeListItem = ({ id, name, onDelete }: ResumeListItemProps) => {
  const { currentCvId, setCurrentCvId } = useCurrentCv();
  const { setTemplateId } = useCvCreationFlow();
  const { open: openDialog } = useDialog();
  const [updateCv] = useUpdateCvMutation();
  const [duplicateCv] = useDuplicateCvMutation({
    refetchQueries: [refetchGetCvsQuery()],
  });

  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const isSelected = currentCvId === id;

  const handleClick = useCallback(() => {
    setCurrentCvId(id);
  }, [id, setCurrentCvId]);

  const handleRename = useCallback(() => {
    setMenuOpen(false);
    setRenameDialogOpen(true);
  }, []);

  const handleRenameSubmit = useCallback(
    (newName: string) => {
      updateCv({
        variables: {
          cvId: id,
          data: { title: newName },
        },
      });
    },
    [id, updateCv]
  );

  const handleUseAsTemplate = useCallback(() => {
    setMenuOpen(false);
    setTemplateId(id);
    openDialog();
  }, [id, setTemplateId, openDialog]);

  const handleDuplicate = useCallback(async () => {
    setMenuOpen(false);
    const result = await duplicateCv({
      variables: { cvId: id },
    });
    if (result.data?.duplicateCv) {
      setCurrentCvId(result.data.duplicateCv._id);
    }
  }, [id, duplicateCv, setCurrentCvId]);

  const handleDelete = useCallback(() => {
    setMenuOpen(false);
    onDelete(id);
  }, [id, onDelete]);

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-colors duration-150',
          isSelected ? 'bg-accent' : 'hover:bg-accent/50'
        )}
      >
        {/* Item Content */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {/* Dot Space */}
          <div className="flex h-1.5 w-1.5 shrink-0 items-center justify-center">
            {isSelected && (
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </div>
          <Typography variant="body2" className="min-w-0 flex-1 truncate">
            {name}
          </Typography>
        </div>

        {/* Action Space */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
          {(isHovered || menuOpen) && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <IconButton
                  size="sm"
                  title="More options"
                  className="p-1 opacity-70 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleRename}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <FileText className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUseAsTemplate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Use as template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        initialName={name}
        onRename={handleRenameSubmit}
      />
    </>
  );
};
