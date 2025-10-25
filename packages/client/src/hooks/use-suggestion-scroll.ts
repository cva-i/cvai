import { useCallback, useRef, useEffect } from 'react';

interface UseSuggestionScrollProps {
  activeSuggestionId: string | null;
  isExpanded: boolean;
}

interface UseSuggestionScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  suggestionRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
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
      const containerRect = container.getBoundingClientRect();
      const elementRect = suggestionElement.getBoundingClientRect();

      // Calculate the position to scroll to within the container
      const scrollTop =
        container.scrollTop + (elementRect.top - containerRect.top) - 20; // 20px offset from top

      // Scroll within the suggestions panel container only
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
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

  return { scrollContainerRef, suggestionRefs, registerSuggestionRef };
};
