import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSuggestions } from '../../../contexts';
import type { Suggestion } from '../../../contexts';
import { DiffView } from './DiffView';
import { extractCurrentText, buildUpdateInputForSuggestion } from './utils';
import type { GetCvQuery } from '../../../generated/graphql';
import { useUpdateCvMutation, useUpdateSuggestionStatusMutation } from '../../../generated/graphql';

const CardContainer = styled(Box)<{ isActive?: boolean }>(
  ({ isActive }) => ({
    border: isActive ? '2px solid #8b5cf6' : '2px solid #f3f4f6',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s ease-out',
    '&:hover': isActive ? {} : { borderColor: '#8b5cf630', transition: 'none' },
  })
);

const HeaderActions = styled(Box)({
  display: 'flex',
  gap: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
});

const ActionButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#6b7280',
  transition: 'color 0.2s ease-in-out',
  padding: 6,
  borderRadius: 8,
  '&:hover': { color: '#111827', backgroundColor: '#f3f4f6' },
  '& svg': { fontSize: '18px' },
}));

const ApplyButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  color: 'white',
  backgroundColor: '#8b5cf6',
  transition: 'background-color 0.2s ease-in-out',
  padding: '8px 16px',
  borderRadius: 8,
  marginTop: '8px',
  '&:hover': { backgroundColor: '#7c3aed' },
  '&:disabled': {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },
}));

const AuthorSection = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginBottom: '4px',
});

const AuthorName = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827',
});

const Timestamp = styled(Typography)({
  fontSize: '13px',
  color: '#9ca3af',
  fontWeight: 400,
});

const CommentText = styled(Typography)({
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '8px',
});

const PreviewLabel = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  marginTop: '12px',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const PreviewText = styled(Typography)({
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#111827',
  backgroundColor: '#f9fafb',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  fontStyle: 'italic',
});

// const ReplyInput = styled(TextField)({
//   '& .MuiOutlinedInput-root': {
//     fontSize: '14px',
//     backgroundColor: '#f9fafb',
//     borderRadius: '6px',
//     '& fieldset': { borderColor: '#e5e7eb' },
//     '&:hover fieldset': { borderColor: '#d1d5db' },
//     '&.Mui-focused fieldset': { borderColor: '#8b5cf6', borderWidth: '1px' },
//   },
//   '& .MuiOutlinedInput-input': {
//     padding: '10px 12px',
//     '&::placeholder': { color: '#9ca3af', opacity: 1 },
//   },
// });

interface SuggestionCardProps {
  suggestion: Suggestion;
  blockId: string;
  cvData: GetCvQuery | undefined;
  isActive: boolean;
  onAccept: () => void;
  onReject: () => void;
  registerRef?: (suggestionId: string, element: HTMLDivElement | null) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  blockId,
  cvData,
  isActive,
  onAccept,
  onReject,
  registerRef,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { setHoveredBlockId, setActiveSuggestionId } = useSuggestions();
  const [updateCvMutation, { loading: updateLoading }] = useUpdateCvMutation();
  const [updateSuggestionStatus] = useUpdateSuggestionStatusMutation();

  const currentText = useMemo(() => {
    if (!suggestion.suggestedText) return null;
    return extractCurrentText(
      cvData,
      blockId,
      suggestion.startOffset,
      suggestion.endOffset
    );
  }, [cvData, blockId, suggestion.startOffset, suggestion.endOffset, suggestion.suggestedText]);

  const handleMouseEnter = useCallback(() => {
    setHoveredBlockId(blockId);
  }, [blockId, setHoveredBlockId]);

  const handleMouseLeave = useCallback(() => {
    setHoveredBlockId(null);
  }, [setHoveredBlockId]);

  const handleCardClick = useCallback(() => {
    setActiveSuggestionId(suggestion._id);
  }, [suggestion._id, setActiveSuggestionId]);

  // Register ref for scrolling
  useEffect(() => {
    if (registerRef && cardRef.current) {
      registerRef(suggestion._id, cardRef.current);
    }
    return () => {
      if (registerRef) {
        registerRef(suggestion._id, null);
      }
    };
  }, [registerRef, suggestion._id]);

  const formatTimestamp = (date?: Date) => {
    if (!date) return 'Just now';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <CardContainer
      ref={cardRef}
      isActive={isActive}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      data-suggestion-card
    >
      {/* Header Actions */}
      <HeaderActions>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onAccept();
          }}
        >
          <CheckIcon />
          <span>Resolve</span>
        </ActionButton>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
        >
          <CloseIcon />
          <span>Reject</span>
        </ActionButton>
      </HeaderActions>

      {/* Author and Timestamp */}
      <AuthorSection>
        <AuthorName>{suggestion.authorName ?? 'AI Assistant'}</AuthorName>
        <Timestamp>· {formatTimestamp(suggestion.createdAt)}</Timestamp>
      </AuthorSection>

      {/* Comment Text */}
      <CommentText>{suggestion.text}</CommentText>

      {/* Show diff view if there's a suggested text replacement */}
      {suggestion.suggestedText && (
        <>
          <PreviewLabel>Suggested Change</PreviewLabel>
          <DiffView
            oldText={currentText || 'Current text (not found)'}
            newText={suggestion.suggestedText}
          />
          <ApplyButton
            onClick={async (e) => {
              e.stopPropagation();
              if (!cvData?.getCv) return;

              const updateInput = buildUpdateInputForSuggestion(cvData, suggestion);
              if (!updateInput) {
                console.error('Failed to build update input', {
                  blockId: suggestion.blockId,
                  cvData: cvData.getCv,
                  suggestion,
                });
                return;
              }
              console.log('Update input:', updateInput);

              try {
                await updateCvMutation({
                  variables: {
                    cvId: cvData.getCv._id,
                    data: updateInput,
                  },
                });

                await updateSuggestionStatus({
                  variables: {
                    input: {
                      suggestionId: suggestion._id,
                      status: 'resolved',
                    },
                  },
                });
              } catch (error) {
                console.error('Failed to apply suggestion:', error);
              }
            }}
          >
            <CheckIcon />
            <span>{updateLoading ? 'Applying...' : 'Apply Change'}</span>
          </ApplyButton>
        </>
      )}

      {/* Show preview for resolved suggestions */}
      {suggestion.status === 'resolved' && !suggestion.suggestedText && (
        <>
          <PreviewLabel>Preview (Resolved)</PreviewLabel>
          <PreviewText>
            This suggestion has been marked as resolved. The text change is being previewed.
          </PreviewText>
        </>
      )}
    </CardContainer>
  );
};
