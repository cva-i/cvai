import { useCallback, useRef, useEffect } from 'react';

interface UseSuggestionScrollProps {
  activeSuggestionId: string | null;
  isExpanded: boolean;
}

interface UseSuggestionScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  registerSuggestionRef: (
    suggestionId: string,
    element: HTMLDivElement | null
  ) => void;
}

export const useSuggestionScroll = ({
  activeSuggestionId,
  isExpanded,
}: UseSuggestionScrollProps): UseSuggestionScrollReturn => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to active suggestion when it changes
  useEffect(() => {
    if (activeSuggestionId && scrollContainerRef.current && isExpanded) {
      // Add a small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const suggestionElement =
          suggestionRefs.current.get(activeSuggestionId);
        if (suggestionElement) {
          scrollToSuggestion(suggestionElement);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [activeSuggestionId, isExpanded]);

  // Function to scroll to a specific suggestion
  const scrollToSuggestion = useCallback(
    (suggestionElement: HTMLDivElement) => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const elementRect = suggestionElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate current position of element relative to container
      const elementTop =
        elementRect.top - containerRect.top + container.scrollTop;

      // Scroll to position the element with some padding from the top (20px)
      const targetScrollTop = elementTop - 20;

      // Scroll within the suggestions panel container only
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    },
    []
  );

  // Function to register a suggestion ref
  const registerSuggestionRef = useCallback(
    (suggestionId: string, element: HTMLDivElement | null) => {
      if (element) {
        suggestionRefs.current.set(suggestionId, element);
      } else {
        suggestionRefs.current.delete(suggestionId);
      }
    },
    []
  );

  return { scrollContainerRef, registerSuggestionRef };
};
