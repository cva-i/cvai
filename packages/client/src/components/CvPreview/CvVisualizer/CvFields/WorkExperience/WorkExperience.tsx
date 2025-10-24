import React from 'react';
import { WorkExperienceEntry } from './WorkExperienceEntry';
import {
  GenericEntriesSection,
  useCvEntries,
  WithRemoveEntryButton,
} from '../../../components';
import type { CvEntryComponentProps } from '../../types';
import type { WorkExperience as WorkExperienceGraphqlType } from '../../../../../generated/graphql';
import {
  refetchGetWorkExperienceEntriesQuery,
  useGetCvQuery,
} from '../../../../../generated/graphql';

export const WorkExperience = ({ cvId }: CvEntryComponentProps) => {
  const useGetEntriesQueryResult = useGetCvQuery({
    variables: { cvId },
  });
  const {
    entries,
    loading,
    updateField,
    removeEntry,
    handleAddEntry,
    moveUp,
    moveDown,
  } = useCvEntries({
    cvId,
    useGetEntriesQueryResult,
    entryFieldName: 'workExperienceEntries',
    refetchQueries: [refetchGetWorkExperienceEntriesQuery({ cvId })],
  });

  return (
    <GenericEntriesSection<WorkExperienceGraphqlType>
      title="Work Experience"
      loading={loading}
      entries={entries}
      noEntriesText="No work experience entries."
      renderEntry={(entry, index) => (
        <WithRemoveEntryButton
          removeEntry={() => removeEntry(entry._id)}
          onAddEntry={handleAddEntry}
          onMoveUp={index > 0 ? () => moveUp(entry._id) : undefined}
          onMoveDown={
            index < entries.length - 1 ? () => moveDown(entry._id) : undefined
          }
          currentEntry={entry}
          key={entry._id}
        >
          <WorkExperienceEntry
            cvId={cvId}
            entry={entry}
            updateField={updateField}
          />
        </WithRemoveEntryButton>
      )}
      onAdd={handleAddEntry}
    />
  );
};
