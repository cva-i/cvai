import type { GetCvQuery } from '../../../generated/graphql';

export function extractCurrentText(
  cvData: GetCvQuery | undefined,
  blockId: string,
  startOffset?: number,
  endOffset?: number
): string | null {
  if (!cvData?.getCv) return null;

  const cv = cvData.getCv;

  // Helper to get text from a field value
  const getFieldText = (value: any): string => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  // Helper to search through entries
  const searchEntries = (entries: any[] | null | undefined, fieldName?: string): string | null => {
    if (!entries) return null;
    for (const entry of entries) {
      if (!entry) continue;

      // Try to find matching field by checking metadata
      if (entry.metadata) {
        for (const [key, meta] of Object.entries(entry.metadata as any)) {
          if (meta && typeof meta === 'object' && 'fieldId' in meta && meta.fieldId === blockId) {
            const text = getFieldText(entry[key]);
            if (startOffset !== undefined && endOffset !== undefined) {
              return text.substring(startOffset, endOffset);
            }
            return text;
          }
        }
      }

      // If no metadata, try direct field match
      for (const [key, value] of Object.entries(entry)) {
        if (key === '_id' || key === '__typename' || key === 'metadata') continue;
        // This is a fallback - ideally we always use metadata
        const text = getFieldText(value);
        if (text && startOffset !== undefined && endOffset !== undefined) {
          return text.substring(startOffset, endOffset);
        }
      }
    }
    return null;
  };

  // Check top-level fields
  if (cv.metadata) {
    const metadata = cv.metadata as any;

    // Check aboutMe
    if (metadata.aboutMe?.description?.fieldId === blockId && cv.aboutMe?.description) {
      const text = cv.aboutMe.description;
      if (startOffset !== undefined && endOffset !== undefined) {
        return text.substring(startOffset, endOffset);
      }
      return text;
    }

    if (metadata.aboutMe?.title?.fieldId === blockId && cv.aboutMe?.title) {
      return cv.aboutMe.title;
    }
  }

  // Search through entry arrays
  let result = searchEntries(cv.workExperienceEntries);
  if (result) return result;

  result = searchEntries(cv.projectEntries);
  if (result) return result;

  result = searchEntries(cv.educationEntries);
  if (result) return result;

  result = searchEntries(cv.skillEntries);
  if (result) return result;

  result = searchEntries(cv.contactInfoEntries);
  if (result) return result;

  return null;
}
