import { Types } from 'mongoose';
import type {
  CvData,
  CvDataMetadata,
  FieldMetadata,
  EntryMetadata,
  AboutMeMetadata,
  Education,
  WorkExperience,
  Project,
  Skill,
  ContactInfo,
  AboutMe,
} from '../../../../../libs/schemas';
import { entries } from "@server/common/utils";

/**
 * Creates a new FieldMetadata with a unique ID
 */
export const createFieldMetadata = (): FieldMetadata => ({
  fieldId: new Types.ObjectId().toString(),
  lastEditedAt: new Date(),
});

/**
 * Creates metadata for an AboutMe section
 */
export const createAboutMeMetadata = (
  aboutMe?: AboutMe
): AboutMeMetadata | undefined => {
  if (!aboutMe) return undefined;

  return {
    title: createFieldMetadata(),
    description: createFieldMetadata(),
  };
};

/**
 * Creates metadata for a single entry
 */
export const createEntryMetadata = (
  entry: Education | WorkExperience | Project | Skill | ContactInfo
): EntryMetadata => {
  const metadata: EntryMetadata = {
    _id: createFieldMetadata(),
    positionIndex: createFieldMetadata(),
  };

  // Add metadata for all defined fields in the entry
  if ('name' in entry) metadata.name = createFieldMetadata();
  if ('position' in entry) metadata.position = createFieldMetadata();
  if ('duration' in entry) metadata.duration = createFieldMetadata();
  if ('location' in entry) metadata.location = createFieldMetadata();
  if ('type' in entry) metadata.type = createFieldMetadata();
  if ('description' in entry) metadata.description = createFieldMetadata();
  if ('skills' in entry) metadata.skills = createFieldMetadata();
  if ('degree' in entry) metadata.degree = createFieldMetadata();
  if ('category' in entry) metadata.category = createFieldMetadata();
  if ('linkName' in entry) metadata.linkName = createFieldMetadata();
  if ('link' in entry) metadata.link = createFieldMetadata();

  return metadata;
};

/**
 * Creates metadata for an entry collection (maps entry ID to entry metadata)
 */
export const createEntriesMetadata = <
  T extends Education | WorkExperience | Project | Skill | ContactInfo,
>(
  metadataEntries: Record<string, T>
): Record<string, EntryMetadata> => {
  const metadata: Record<string, EntryMetadata> = {};

  for (const [entryId, entry] of entries(metadataEntries)) {
    metadata[entryId] = createEntryMetadata(entry);
  }

  return metadata;
};

/**
 * Builds reverse ID mapping from metadata structure
 */
export const buildReverseIdMapping = (
  metadata: Omit<CvDataMetadata, 'reverseIdMapping'>
): Record<string, string> => {
  const reverseMap: Record<string, string> = {};

  // Top-level fields
  if (metadata.title) {
    reverseMap[metadata.title.fieldId] = 'title';
  }
  if (metadata.name) {
    reverseMap[metadata.name.fieldId] = 'name';
  }

  // AboutMe fields
  if (metadata.aboutMe?.title) {
    reverseMap[metadata.aboutMe.title.fieldId] = 'aboutMe.title';
  }
  if (metadata.aboutMe?.description) {
    reverseMap[metadata.aboutMe.description.fieldId] = 'aboutMe.description';
  }

  // Entry fields
  const entryTypes = [
    'educationEntries',
    'workExperienceEntries',
    'projectEntries',
    'skillEntries',
    'contactInfoEntries',
  ] as const;

  for (const entryType of entryTypes) {
    const metadataEntries = metadata[entryType];
    if (!metadataEntries) continue;

    for (const [entryId, entryMetadata] of entries(metadataEntries)) {
      for (const [fieldName, fieldMetadata] of entries(entryMetadata)) {
        if (fieldMetadata && typeof fieldMetadata === 'object' && 'fieldId' in fieldMetadata) {
          reverseMap[fieldMetadata.fieldId] = `${entryType}.${entryId}.${fieldName}`;
        }
      }
    }
  }

  return reverseMap;
};

/**
 * Creates complete metadata for CV data
 */
export const createCvDataMetadata = (cvData: CvData): CvDataMetadata => {
  const metadata: Omit<CvDataMetadata, 'reverseIdMapping'> = {
    title: createFieldMetadata(),
    name: createFieldMetadata(),
    aboutMe: createAboutMeMetadata(cvData.aboutMe),
    educationEntries: createEntriesMetadata(cvData.educationEntries),
    workExperienceEntries: createEntriesMetadata(cvData.workExperienceEntries),
    projectEntries: createEntriesMetadata(cvData.projectEntries),
    skillEntries: createEntriesMetadata(cvData.skillEntries),
    contactInfoEntries: createEntriesMetadata(cvData.contactInfoEntries),
  };

  return {
    ...metadata,
    reverseIdMapping: buildReverseIdMapping(metadata),
  };
};

/**
 * Updates metadata when a new entry is added
 */
export const addEntryMetadata = (
  existingMetadata: CvDataMetadata,
  entryFieldName: keyof Pick<
    CvDataMetadata,
    | 'educationEntries'
    | 'workExperienceEntries'
    | 'projectEntries'
    | 'skillEntries'
    | 'contactInfoEntries'
  >,
  entryId: string,
  entry: Education | WorkExperience | Project | Skill | ContactInfo
): CvDataMetadata => {
  const updatedMetadata = { ...existingMetadata };
  const entriesMetadata = updatedMetadata[entryFieldName] ?? {};

  updatedMetadata[entryFieldName] = {
    ...entriesMetadata,
    [entryId]: createEntryMetadata(entry),
  };

  // Rebuild reverse mapping
  const { reverseIdMapping, ...metadataWithoutReverse } = updatedMetadata;
  updatedMetadata.reverseIdMapping = buildReverseIdMapping(metadataWithoutReverse);

  return updatedMetadata;
};

/**
 * Removes metadata when an entry is deleted
 */
export const removeEntryMetadata = (
  existingMetadata: CvDataMetadata,
  entryFieldName: keyof Pick<
    CvDataMetadata,
    | 'educationEntries'
    | 'workExperienceEntries'
    | 'projectEntries'
    | 'skillEntries'
    | 'contactInfoEntries'
  >,
  entryId: string
): CvDataMetadata => {
  const updatedMetadata = { ...existingMetadata };
  const entriesMetadata = { ...(updatedMetadata[entryFieldName] ?? {}) };

  delete entriesMetadata[entryId];
  updatedMetadata[entryFieldName] = entriesMetadata;

  // Rebuild reverse mapping
  const { reverseIdMapping, ...metadataWithoutReverse } = updatedMetadata;
  updatedMetadata.reverseIdMapping = buildReverseIdMapping(metadataWithoutReverse);

  return updatedMetadata;
};

/**
 * Updates lastEditedAt for a specific field when it's modified
 */
export const touchFieldMetadata = (
  existingMetadata: CvDataMetadata,
  fieldPath: string // e.g., "title", "aboutMe.description", "workExperienceEntries.{id}.position"
): CvDataMetadata => {
  const updatedMetadata = { ...existingMetadata };
  const pathParts = fieldPath.split('.');

  // Helper to navigate and update the metadata structure
  const updateNested = (obj: any, parts: string[], index: number): void => {
    if (index >= parts.length - 1) {
      const lastPart = parts[parts.length - 1];
      if (obj[lastPart]) {
        obj[lastPart] = {
          ...obj[lastPart],
          lastEditedAt: new Date(),
        };
      }
      return;
    }

    const currentPart = parts[index];
    if (obj[currentPart]) {
      obj[currentPart] = { ...obj[currentPart] };
      updateNested(obj[currentPart], parts, index + 1);
    }
  };

  updateNested(updatedMetadata, pathParts, 0);
  return updatedMetadata;
};
