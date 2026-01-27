import React from 'react';
import type { CvEntryComponentProps } from '../../types';
import type { Education as EducationGraphqlType } from '../../../../../generated/graphql';
import {
  refetchGetEducationEntriesQuery,
  useGetCvQuery,
} from '../../../../../generated/graphql';
import { EducationEntry } from './EducationEntry';
import {
  GenericEntriesSection,
  useCvEntries,
  WithEntryControls,
} from '../../../components';

export const Education: React.FC<CvEntryComponentProps> = ({ cvId }) => {
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
    entryFieldName: 'educationEntries',
    refetchQueries: [refetchGetEducationEntriesQuery({ cvId })],
  });

  return (
    <GenericEntriesSection<EducationGraphqlType>
      title="Education"
      loading={loading}
      entries={entries}
      noEntriesText="No education entries available."
      gap={2}
      renderEntry={(entry, index) => (
        <WithEntryControls
          removeEntry={() => removeEntry(entry._id)}
          onAddEntry={handleAddEntry}
          onMoveUp={index > 0 ? () => moveUp(entry._id) : undefined}
          onMoveDown={
            index < entries.length - 1 ? () => moveDown(entry._id) : undefined
          }
          currentEntry={entry}
          key={entry._id}
        >
          <EducationEntry cvId={cvId} entry={entry} updateField={updateField} />
        </WithEntryControls>
      )}
      onAdd={() => handleAddEntry()}
    />
  );
};
