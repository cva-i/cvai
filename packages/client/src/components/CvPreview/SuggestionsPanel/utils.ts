import type { GetCvQuery, UpdateCvInput, Suggestion } from '../../../generated/graphql';

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

function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
}

export function applyTextSubstitution(
  originalText: string,
  suggestedText: string,
  highlightType: string,
  sentenceIndex: number | null,
  startOffset: number | null,
  endOffset: number | null
): string {
  if (highlightType === 'section') {
    return suggestedText;
  }

  if (highlightType === 'sentence' && sentenceIndex !== null) {
    const sentences = splitIntoSentences(originalText);
    if (sentenceIndex < sentences.length) {
      const newSentences = [...sentences];
      newSentences[sentenceIndex] = suggestedText;
      return newSentences.join('');
    }
  }

  if (highlightType === 'chunk' && startOffset !== null && endOffset !== null) {
    return originalText.substring(0, startOffset) + suggestedText + originalText.substring(endOffset);
  }

  return originalText;
}

export function buildUpdateInputForSuggestion(
  cvData: GetCvQuery | undefined,
  suggestion: any
): UpdateCvInput | null {
  if (!cvData?.getCv || !suggestion.suggestedText) {
    console.log('Missing cvData or suggestedText', { cvData: cvData?.getCv, suggestion });
    return null;
  }

  const cv = cvData.getCv;
  const blockId = suggestion.blockId;
  const metadata = cv.metadata as any;

  if (!metadata) {
    console.log('No metadata on CV');
    return null;
  }

  console.log('Looking for blockId:', blockId, 'in metadata:', metadata);

  const findFieldInfo = (
    entries: any[] | null | undefined,
    entryTypeKey: string,
    metadataEntries: any
  ): any => {
    if (!entries || !metadataEntries) return null;

    for (const entry of entries) {
      const entryMetadata = metadataEntries[entry._id];
      if (!entryMetadata) continue;

      for (const [fieldName, fieldMeta] of Object.entries(entryMetadata as any)) {
        if (fieldMeta && typeof fieldMeta === 'object' && 'fieldId' in fieldMeta && fieldMeta.fieldId === blockId) {
          const originalText = typeof entry[fieldName] === 'string' ? entry[fieldName] : String(entry[fieldName] || '');
          const newText = applyTextSubstitution(
            originalText,
            suggestion.suggestedText,
            suggestion.highlightType,
            suggestion.sentenceIndex,
            suggestion.startOffset,
            suggestion.endOffset
          );
          console.log('Found field in entry', { entryId: entry._id, fieldName, originalText, newText });
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
  };

  if (metadata.aboutMe?.description?.fieldId === blockId && cv.aboutMe?.description) {
    const newText = applyTextSubstitution(
      cv.aboutMe.description,
      suggestion.suggestedText,
      suggestion.highlightType,
      suggestion.sentenceIndex,
      suggestion.startOffset,
      suggestion.endOffset
    );
    return {
      aboutMe: { description: newText },
    };
  }

  if (metadata.aboutMe?.title?.fieldId === blockId && cv.aboutMe?.title) {
    return {
      aboutMe: { title: suggestion.suggestedText },
    };
  }

  if (metadata.title?.fieldId === blockId) {
    return { title: suggestion.suggestedText };
  }

  if (metadata.name?.fieldId === blockId) {
    return { name: suggestion.suggestedText };
  }

  let fieldInfo = findFieldInfo(cv.workExperienceEntries, 'workExperienceEntries', metadata.workExperienceEntries);
  if (fieldInfo) {
    return {
      workExperienceEntries: [{
        _id: fieldInfo.entryId,
        [fieldInfo.fieldName]: fieldInfo.value,
      }],
    };
  }

  fieldInfo = findFieldInfo(cv.projectEntries, 'projectEntries', metadata.projectEntries);
  if (fieldInfo) {
    return {
      projectEntries: [{
        _id: fieldInfo.entryId,
        [fieldInfo.fieldName]: fieldInfo.value,
      }],
    };
  }

  fieldInfo = findFieldInfo(cv.educationEntries, 'educationEntries', metadata.educationEntries);
  if (fieldInfo) {
    return {
      educationEntries: [{
        _id: fieldInfo.entryId,
        [fieldInfo.fieldName]: fieldInfo.value,
      }],
    };
  }

  fieldInfo = findFieldInfo(cv.skillEntries, 'skillEntries', metadata.skillEntries);
  if (fieldInfo) {
    return {
      skillEntries: [{
        _id: fieldInfo.entryId,
        [fieldInfo.fieldName]: fieldInfo.value,
      }],
    };
  }

  fieldInfo = findFieldInfo(cv.contactInfoEntries, 'contactInfoEntries', metadata.contactInfoEntries);
  if (fieldInfo) {
    return {
      contactInfoEntries: [{
        _id: fieldInfo.entryId,
        [fieldInfo.fieldName]: fieldInfo.value,
      }],
    };
  }

  console.log('No matching field found for blockId:', blockId);
  return null;
}
