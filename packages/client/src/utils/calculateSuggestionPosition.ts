/**
 * Calculates the Y position for a suggestion card based on the block ID
 * @param blockId - The ID of the EditableTypography element
 * @param containerRef - Reference to the scroll container (optional)
 * @returns Y position in pixels relative to the container, or null if element not found
 */
export const calculateSuggestionPosition = (
  blockId: string,
  containerRef?: React.RefObject<HTMLElement>
): number | null => {
  const element = document.getElementById(blockId);
  if (!element) {
    return null;
  }

  const elementRect = element.getBoundingClientRect();

  // If we have a container reference, calculate relative to that container
  if (containerRef?.current) {
    const containerRect = containerRef.current.getBoundingClientRect();
    return elementRect.top - containerRect.top + containerRef.current.scrollTop;
  }

  // Otherwise, calculate relative to the viewport
  return elementRect.top + window.scrollY;
};

/**
 * Gets the height of an element by its ID
 * @param blockId - The ID of the element
 * @returns Height in pixels, or 0 if element not found
 */
export const getElementHeight = (blockId: string): number => {
  const element = document.getElementById(blockId);
  if (!element) {
    return 0;
  }
  return element.getBoundingClientRect().height;
};

/**
 * Checks if an element is currently visible in the viewport
 * @param blockId - The ID of the element
 * @returns True if element is visible, false otherwise
 */
export const isElementVisible = (blockId: string): boolean => {
  const element = document.getElementById(blockId);
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
