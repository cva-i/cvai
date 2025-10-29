import React from 'react';
import { ProjectEntry } from './ProjectEntry';
import {
  GenericEntriesSection,
  useCvEntries,
  WithEntryControls,
} from '../../../components';
import type { CvEntryComponentProps } from '../../types';
import type { Project as ProjectGraphqlType } from '../../../../../generated/graphql';
import {
  refetchGetProjectEntriesQuery,
  useGetCvQuery,
} from '../../../../../generated/graphql';

export const Projects = ({ cvId }: CvEntryComponentProps) => {
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
    entryFieldName: 'projectEntries',
    refetchQueries: [refetchGetProjectEntriesQuery({ cvId })],
  });

  return (
    <GenericEntriesSection<ProjectGraphqlType>
      title="Projects"
      loading={loading}
      entries={entries}
      noEntriesText="No project entries."
      renderEntry={(project, index) => (
        <WithEntryControls
          removeEntry={() => removeEntry(project._id)}
          onAddEntry={handleAddEntry}
          onMoveUp={index > 0 ? () => moveUp(project._id) : undefined}
          onMoveDown={
            index < entries.length - 1 ? () => moveDown(project._id) : undefined
          }
          currentEntry={project}
          key={project._id}
        >
          <ProjectEntry cvId={cvId} entry={project} updateField={updateField} />
        </WithEntryControls>
      )}
      onAdd={() => handleAddEntry()}
    />
  );
};
