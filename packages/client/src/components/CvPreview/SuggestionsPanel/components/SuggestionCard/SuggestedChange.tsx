import React from 'react';
import { DiffView } from '../../DiffView';
import { previewLabelClasses } from '../../SuggestionCard/styled';

type SuggestedChangeProps = {
  currentText: string | null;
  suggestedText: string;
};

export const SuggestedChange: React.FC<SuggestedChangeProps> = ({
  currentText,
  suggestedText,
}) => {
  return (
    <>
      <span className={previewLabelClasses}>Suggested Change</span>
      <DiffView
        oldText={currentText ?? 'Current text (not found)'}
        newText={suggestedText}
      />
    </>
  );
};
