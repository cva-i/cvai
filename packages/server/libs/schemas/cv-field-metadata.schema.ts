import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/**
 * Field metadata for a single field in the CV
 */
export class FieldMetadata {
  fieldId!: string; // Unique identifier for this field
  lastEditedAt?: Date;
}

/**
 * Metadata for a single entry (e.g., one education entry, one work experience entry)
 */
export class EntryMetadata {
  // Common fields across all entry types
  _id?: FieldMetadata;
  name?: FieldMetadata;
  positionIndex?: FieldMetadata;

  // WorkExperience specific fields
  position?: FieldMetadata;
  duration?: FieldMetadata;
  location?: FieldMetadata;
  type?: FieldMetadata;
  description?: FieldMetadata;
  skills?: FieldMetadata;

  // Education specific fields
  degree?: FieldMetadata;

  // Project specific fields
  // (shares description and skills with WorkExperience)

  // Skill specific fields
  category?: FieldMetadata;
  // (shares skills field)

  // ContactInfo specific fields
  linkName?: FieldMetadata;
  link?: FieldMetadata;
}

/**
 * Metadata for AboutMe section
 */
export class AboutMeMetadata {
  title?: FieldMetadata;
  description?: FieldMetadata;
}

/**
 * Main CV field metadata structure that mirrors the CV data structure
 */
export class CvDataMetadata {
  // Top-level CV fields
  title?: FieldMetadata;
  name?: FieldMetadata;
  aboutMe?: AboutMeMetadata;

  // Entry collections (maps entry ID to entry metadata)
  educationEntries?: Record<string, EntryMetadata>;
  workExperienceEntries?: Record<string, EntryMetadata>;
  projectEntries?: Record<string, EntryMetadata>;
  skillEntries?: Record<string, EntryMetadata>;
  contactInfoEntries?: Record<string, EntryMetadata>;

  // Reverse mapping: fieldId -> field path (e.g., "workExperienceEntries.{entryId}.description")
  // This allows quick lookup of which field a suggestion belongs to
  reverseIdMapping?: Record<string, string>;
}

/**
 * MongoDB document for CV field metadata
 * One metadata document per CV (not per version - metadata is shared across versions)
 */
@Schema({ timestamps: true })
export class CvFieldMetadata {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  cvId!: Types.ObjectId; // Links to the CV document

  @Prop({ required: true })
  userId!: string; // For easy querying

  @Prop({ type: Object, required: true })
  metadata!: CvDataMetadata; // The actual field metadata

  createdAt?: Date;
  updatedAt?: Date;
}

export type CvFieldMetadataDocument = CvFieldMetadata & Document;
export const CvFieldMetadataSchema =
  SchemaFactory.createForClass(CvFieldMetadata);
