import { match, P } from 'ts-pattern';
import type { GetCvQuery } from '../../../../generated/graphql';

/**
 * Converts various field value types to string
 */
export function fieldValueToString(value: unknown): string {
  return match(value)
    .with(P.string, (str) => str)
    .with(P.array(P.any), (arr) => arr.join(', '))
    .with(P.nullish, () => '')
    .otherwise((val) => String(val));
}

/**
 * Extracts text from a specific entry field
 */
function extractFromEntry(
  entry: any,
  blockId: string
): string | null {
  if (!entry?.metadata) return null;

  for (const [fieldName, meta] of Object.entries(entry.metadata as any)) {
    const fieldMeta = meta as any;
    if (fieldMeta?.fieldId === blockId) {
      return fieldValueToString(entry[fieldName]);
    }
  }

  return null;
}

/**
 * Searches through an array of entries for matching field
 */
function searchEntries(
  entries: any[] | null | undefined,
  blockId: string
): string | null {
  if (!entries) return null;

  for (const entry of entries) {
    const result = extractFromEntry(entry, blockId);
    if (result !== null) return result;
  }

  return null;
}

/**
 * Type guard for CV metadata structure
 */
function hasMetadata(cv: any): cv is any {
  return cv && typeof cv.metadata === 'object' && cv.metadata !== null;
}

/**
 * Extracts text from aboutMe section
 */
function extractFromAboutMe(
  cv: any,
  blockId: string
): string | null {
  if (!hasMetadata(cv) || !cv.aboutMe) return null;

  const { metadata, aboutMe } = cv;

  // Check description field
  if (
    metadata.aboutMe?.description?.fieldId === blockId &&
    aboutMe.description
  ) {
    return aboutMe.description;
  }

  // Check title field
  if (metadata.aboutMe?.title?.fieldId === blockId && aboutMe.title) {
    return aboutMe.title;
  }

  return null;
}

/**
 * Extracts current text from CV data based on blockId
 */
export function extractCurrentText(
  cvData: GetCvQuery | undefined,
  blockId: string
): string | null {
  if (!cvData?.getCv) return null;

  const cv = cvData.getCv;

  // Try aboutMe section first
  const aboutMeText = extractFromAboutMe(cv, blockId);
  if (aboutMeText !== null) return aboutMeText;

  // Search through different entry types
  const entryTypes = [
    'workExperienceEntries',
    'projectEntries',
    'educationEntries',
    'skillEntries',
    'contactInfoEntries',
  ] as const;

  for (const entryType of entryTypes) {
    const result = searchEntries(cv[entryType], blockId);
    if (result !== null) return result;
  }

  return null;
}
