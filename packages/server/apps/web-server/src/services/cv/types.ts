import type {
  CvEntryType,
  CreateWorkExperienceInput,
  CreateSkillInput,
  CreateEducationInput,
  CreateProjectInput,
  CreateContactInfoInput,
} from './dto';

export type CvManagerMethodProps = {
  cvId: string;
  userId: string;
};

export type EntryItemSelectorProps = {
  entryItemId: string;
  entryFieldName: CvEntryType;
};
export type CvEntryItemManagerProps = CvManagerMethodProps &
  EntryItemSelectorProps;

export type CreateEntryItemProps = {
  entryFieldName: CvEntryType;
  positionIndex: number;
};

export type CreateEntryItemInput =
  | CreateWorkExperienceInput
  | CreateSkillInput
  | CreateEducationInput
  | CreateProjectInput
  | CreateContactInfoInput;
