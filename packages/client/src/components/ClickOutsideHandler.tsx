import React from 'react';
import { useSuggestions } from '../contexts/use-suggestions/SuggestionsProvider';

interface ClickOutsideHandlerProps {
  children: React.ReactNode;
}

export const ClickOutsideHandler: React.FC<ClickOutsideHandlerProps> = ({
  children,
}) => {
  const { clearActiveSuggestion } = useSuggestions();

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    // Don't clear if clicking on suggestion-related elements
    if (
      target.closest('[data-suggestion-card]') ||
      target.closest('[data-suggestion-panel]') ||
      target.closest('[data-highlighted-text]')
    ) {
      return;
    }

    // Clear suggestion when clicking anywhere else
    clearActiveSuggestion();
  };

  return <div onClick={handleClick}>{children}</div>;
};
