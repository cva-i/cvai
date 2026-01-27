import React from 'react';
import { format } from 'date-fns';
import { MoreVertical, GitCompare, Copy } from 'lucide-react';
import { StandardListItem } from '../../atoms/List';
import { Typography, IconButton } from '../../atoms';
import { Badge } from '../../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import type { CvVersionHistoryEntryObjectType } from '../../../generated/graphql';

interface VersionHistoryItemProps {
  version: CvVersionHistoryEntryObjectType;
  onCompareClick?: (versionId: string) => void;
  onCreateFromClick: (versionId: string) => void;
  onClick?: (versionId: string) => void;
}

export const VersionHistoryItem: React.FC<VersionHistoryItemProps> = ({
  version,
  onCompareClick,
  onCreateFromClick,
  onClick,
}) => {
  const handleCompareClick = () => {
    if (onCompareClick) {
      onCompareClick(version._id);
    }
  };

  const handleCreateFromClick = () => {
    onCreateFromClick(version._id);
  };

  const renderVersionLabel = () => (
    <div className="flex items-center justify-between">
      <Typography variant="body1" className="flex items-center gap-2">
        Version {version.versionNumber}
        {version.isCurrentVersion && (
          <Badge className="h-[18px] text-[10px] px-1.5">Current</Badge>
        )}
      </Typography>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            size="sm"
            title="More actions"
            aria-label="more"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          {onCompareClick && (
            <DropdownMenuItem onClick={handleCompareClick}>
              <GitCompare className="mr-2 h-4 w-4" />
              Compare with current
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleCreateFromClick}>
            <Copy className="mr-2 h-4 w-4" />
            Create new CV from this version
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const formattedDate = `Created: ${format(
    new Date(version.createdAt),
    'MMM d, yyyy HH:mm'
  )}`;

  return (
    <StandardListItem
      _id={version._id}
      item={version}
      primary={renderVersionLabel()}
      secondary={formattedDate}
      highlight={version.isCurrentVersion}
      onClick={onClick}
    />
  );
};
