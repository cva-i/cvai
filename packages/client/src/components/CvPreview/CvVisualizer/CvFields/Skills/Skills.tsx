import React from 'react';
import { SkillEntry } from './SkillEntry';
import {
  GenericEntriesSection,
  useCvEntries,
  WithEntryControls,
} from '../../../components';
import type { CvEntryComponentProps } from '../../types';
import type { Skill as SkillGraphqlType } from '../../../../../generated/graphql';
import {
  refetchGetSkillEntriesQuery,
  useGetCvQuery,
} from '../../../../../generated/graphql';

export const Skills: React.FC<CvEntryComponentProps> = ({ cvId }) => {
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
    entryFieldName: 'skillEntries',
    refetchQueries: [refetchGetSkillEntriesQuery({ cvId })],
  });

  return (
    <GenericEntriesSection<SkillGraphqlType>
      loading={loading}
      entries={entries}
      noEntriesText="No skills available."
      renderEntry={(skill, index) => (
        <WithEntryControls
          removeEntry={() => removeEntry(skill._id)}
          onAddEntry={handleAddEntry}
          onMoveUp={index > 0 ? () => moveUp(skill._id) : undefined}
          onMoveDown={
            index < entries.length - 1 ? () => moveDown(skill._id) : undefined
          }
          currentEntry={skill}
          key={skill._id}
        >
          <SkillEntry cvId={cvId} entry={skill} updateField={updateField} />
        </WithEntryControls>
      )}
      onAdd={() => handleAddEntry()}
    />
  );
};
