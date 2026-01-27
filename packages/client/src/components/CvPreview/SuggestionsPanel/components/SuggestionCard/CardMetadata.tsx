import React from 'react';

interface CardMetadataProps {
  authorName?: string | null;
  createdAt?: Date;
}

/**
 * Formats timestamp as relative time
 */
function formatTimestamp(date?: Date): string {
  if (!date) {
    return 'Just now';
  }

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const minutesAgo = Math.floor((date.getTime() - Date.now()) / (1000 * 60));

  return formatter.format(minutesAgo, 'minute');
}

export const CardMetadata: React.FC<CardMetadataProps> = ({
  authorName,
  createdAt,
}) => {
  return (
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-sm font-semibold text-gray-900">
        {authorName ?? 'AI Assistant'}
      </span>
      <span className="text-[13px] text-gray-400 font-normal">
        · {formatTimestamp(createdAt)}
      </span>
    </div>
  );
};
