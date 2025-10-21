import { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  styled,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCurrentCv, useCvCreationFlow, useDialog } from '../../contexts';
import { useUpdateCvMutation } from '../../generated/graphql';
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

  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const isSelected = currentCvId === id;
  const menuOpen = Boolean(anchorEl);

  const handleClick = useCallback(() => {
    setCurrentCvId(id);
  }, [id, setCurrentCvId]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleRename = useCallback(() => {
    handleMenuClose();
    setRenameDialogOpen(true);
  }, [handleMenuClose]);

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
    handleMenuClose();
    setTemplateId(id);
    openDialog();
  }, [handleMenuClose, id, setTemplateId, openDialog]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    onDelete(id);
  }, [handleMenuClose, id, onDelete]);

  return (
    <>
      <ItemContainer
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        isSelected={isSelected}
      >
        <ItemContent>
          <DotSpace>{isSelected && <ActiveDot />}</DotSpace>
          <ItemText variant="body2" noWrap>
            {name}
          </ItemText>
        </ItemContent>

        <ActionSpace>
          {(isHovered || menuOpen) && (
            <ActionsButton size="small" onClick={handleMenuOpen}>
              <MoreHorizIcon fontSize="small" />
            </ActionsButton>
          )}
        </ActionSpace>
      </ItemContainer>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      >
        <MenuItem onClick={handleRename}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleUseAsTemplate}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Use as template
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        initialName={name}
        onRename={handleRenameSubmit}
      />
    </>
  );
};

const ItemContainer = styled(Box)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 1),
    cursor: 'pointer',
    backgroundColor: isSelected
      ? theme.palette.action.selected
      : 'transparent',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: isSelected
        ? theme.palette.action.selected
        : theme.palette.action.hover,
    },
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.short,
    }),
  })
);

const ItemContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  overflow: 'hidden',
  minWidth: 0,
});

const DotSpace = styled(Box)({
  width: '6px',
  height: '6px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ActiveDot = styled(Box)(({ theme }) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

const ActionSpace = styled(Box)({
  width: '32px',
  height: '32px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ItemText = styled(Typography)({
  flex: 1,
  overflow: 'hidden',
  minWidth: 0,
});

const ActionsButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.action.hover,
  },
}));
