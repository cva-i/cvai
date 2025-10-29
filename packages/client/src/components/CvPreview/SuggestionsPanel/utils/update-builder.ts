import { match, P } from 'ts-pattern';
import type { GetCvQuery, UpdateCvInput } from '../../../../generated/graphql';
import { applyTextSubstitution } from './text-substitution';

/**
 * Suggestion data needed for building update input
 */
interface SuggestionData {
  blockId: string;
  suggestedText: string;
}

/**
 * Field information found in an entry
 */
interface FieldInfo {
  entryId: string;
  fieldName: string;
  value: string;
  entryTypeKey: string;
}

/**
 * Type guard for checking if CV has metadata
 */
function hasValidMetadata(cv: any): cv is any {
  return cv && typeof cv.metadata === 'object' && cv.metadata !== null;
}

/**
 * Finds field info in entries using metadata
 */
function findFieldInEntries(
  entries: any[] | null | undefined,
  entryTypeKey: string,
  metadataEntries: any,
  suggestion: SuggestionData
): FieldInfo | null {
  if (!entries || !metadataEntries) return null;

  for (const entry of entries) {
    const entryMetadata = metadataEntries[entry._id];
    if (!entryMetadata) continue;

    for (const [fieldName, fieldMeta] of Object.entries(entryMetadata as any)) {
      if (
        fieldMeta &&
        typeof fieldMeta === 'object' &&
        'fieldId' in fieldMeta &&
        fieldMeta.fieldId === suggestion.blockId
      ) {
        const newText = applyTextSubstitution(suggestion.suggestedText);

        return {
          entryId: entry._id,
          fieldName,
          value: newText,
          entryTypeKey,
        };
      }
    }
  }

  return null;
}

/**
 * Builds update input for aboutMe field
 */
function buildAboutMeUpdate(
  cv: any,
  suggestion: SuggestionData
): UpdateCvInput | null {
  if (!hasValidMetadata(cv) || !cv.aboutMe) return null;

  const { metadata, aboutMe } = cv;

  // Check description field
  if (
    metadata.aboutMe?.description?.fieldId === suggestion.blockId &&
    aboutMe?.description
  ) {
    const newText = applyTextSubstitution(suggestion.suggestedText);
    return { aboutMe: { description: newText } };
  }

  // Check title field (fieldName in aboutMe)
  if (metadata.aboutMe?.title?.fieldId === suggestion.blockId && aboutMe?.title) {
    return {
      aboutMe: {
        fieldName: suggestion.suggestedText,
      },
    };
  }

  return null;
}

/**
 * Builds update input for top-level fields (title, name)
 */
function buildTopLevelUpdate(
  cv: any,
  suggestion: SuggestionData
): UpdateCvInput | null {
  if (!hasValidMetadata(cv)) return null;

  const { metadata } = cv;

  return match(suggestion.blockId)
    .with(metadata.title?.fieldId, () => ({ title: suggestion.suggestedText }))
    .with(metadata.name?.fieldId, () => ({ name: suggestion.suggestedText }))
    .otherwise(() => null);
}

/**
 * Builds update input for entry fields
 */
function buildEntryUpdate(
  cv: any,
  suggestion: SuggestionData
): UpdateCvInput | null {
  if (!hasValidMetadata(cv)) return null;

  const { metadata } = cv;

  const entrySearches = [
    {
      entries: cv.workExperienceEntries || [],
      key: 'workExperienceEntries' as const,
      metadata: metadata.workExperienceEntries,
    },
    {
      entries: cv.projectEntries || [],
      key: 'projectEntries' as const,
      metadata: metadata.projectEntries,
    },
    {
      entries: cv.educationEntries || [],
      key: 'educationEntries' as const,
      metadata: metadata.educationEntries,
    },
    {
      entries: cv.skillEntries || [],
      key: 'skillEntries' as const,
      metadata: metadata.skillEntries,
    },
    {
      entries: cv.contactInfoEntries || [],
      key: 'contactInfoEntries' as const,
      metadata: metadata.contactInfoEntries,
    },
  ];

  for (const { entries, key, metadata: entryMetadata } of entrySearches) {
    const fieldInfo = findFieldInEntries(entries, key, entryMetadata, suggestion);

    if (fieldInfo) {
      return {
        [fieldInfo.entryTypeKey]: [
          {
            _id: fieldInfo.entryId,
            [fieldInfo.fieldName]: fieldInfo.value,
          },
        ],
      };
    }
  }

  return null;
}

/**
 * Builds UpdateCvInput from a suggestion
 */
export function buildUpdateInputForSuggestion(
  cvData: GetCvQuery | undefined,
  suggestion: SuggestionData
): UpdateCvInput | null {
  if (!cvData?.getCv || !suggestion.suggestedText) {
    console.log('Missing cvData or suggestedText', {
      cvData: cvData?.getCv,
      suggestion,
    });
    return null;
  }

  const cv = cvData.getCv;

  // Try different update strategies
  return match<any, UpdateCvInput | null>(null)
    .when(() => buildAboutMeUpdate(cv, suggestion) !== null, () =>
      buildAboutMeUpdate(cv, suggestion)
    )
    .when(() => buildTopLevelUpdate(cv, suggestion) !== null, () =>
      buildTopLevelUpdate(cv, suggestion)
    )
    .when(() => buildEntryUpdate(cv, suggestion) !== null, () =>
      buildEntryUpdate(cv, suggestion)
    )
    .otherwise(() => {
      console.log('No matching field found for blockId:', suggestion.blockId);
      return null;
    });
}
