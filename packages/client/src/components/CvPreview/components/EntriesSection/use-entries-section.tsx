import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GetCvQueryHookResult } from '../../../../generated/graphql';
import {
  CvEntryType,
  useDeleteEntryItemMutation,
  useGenerateNewEntryItemMutation,
  useGetCvQuery,
  useUpdateCvMutation,
} from '../../../../generated/graphql';
import { sortByPosition } from '../../../utils';
import type { InternalRefetchQueriesInclude } from '@apollo/client';
import type {
  CvEntryArrayFieldName,
  CvEntryItem,
  UpdateItemizedFieldProps,
} from '../../CvVisualizer/types';
import { match } from 'ts-pattern';

interface UseCvEntriesOptions<T extends CvEntryArrayFieldName> {
  cvId: string;
  entryFieldName: T;
  useGetEntriesQueryResult: GetCvQueryHookResult;
  refetchQueries: InternalRefetchQueriesInclude;
}

export function useCvEntries<T extends CvEntryArrayFieldName>(
  options: UseCvEntriesOptions<T>
) {
  const { cvId, entryFieldName, refetchQueries } = options;

  const entryType = useMemo(
    () =>
      match(entryFieldName as unknown as CvEntryArrayFieldName)
        .returnType<CvEntryType>()
        .with('workExperienceEntries', () => CvEntryType.WorkExperience)
        .with('educationEntries', () => CvEntryType.Education)
        .with('projectEntries', () => CvEntryType.Project)
        .with('skillEntries', () => CvEntryType.Skill)
        .with('contactInfoEntries', () => CvEntryType.ContactInfo)
        .exhaustive(),
    [entryFieldName]
  );

  // TODO: update to dynamic query, ideally. because I don't wanna fetch the whole CV since it's sub-optimal.
  //   The dynamic document should fetch only the selected fields given by entryFieldName.
  //   Then, there should be a map entryFieldName => CorrectFragment
  const { data, loading } = useGetCvQuery({
    variables: {
      cvId,
    },
  });

  const entriesData = useMemo(
    () => data?.getCv?.[entryFieldName] ?? [],
    [data, entryFieldName]
  );

  const [entries, setEntries] = useState<typeof entriesData>([]);

  const [updateCv] = useUpdateCvMutation({
    refetchQueries,
  });
  const [deleteEntryItemMutation] = useDeleteEntryItemMutation({
    refetchQueries,
  });
  const [generateNewEntryItemMutation] = useGenerateNewEntryItemMutation({
    refetchQueries,
  });

  useEffect(() => {
    setEntries(sortByPosition<CvEntryItem>(entriesData) as typeof entriesData);
  }, [entriesData]);

  const updateField = useCallback(
    async ({
      _id,
      fieldName,
      value,
    }: UpdateItemizedFieldProps<typeof entryFieldName>) => {
      const updateData = {
        [entryFieldName]: [{ _id, [fieldName]: value }],
      };
      await updateCv({
        variables: {
          cvId,
          data: updateData,
        },
      });
    },
    [cvId, updateCv, entryFieldName]
  );

  const removeEntry = useCallback(
    async (entryItemId: string) => {
      await deleteEntryItemMutation({
        variables: {
          cvId,
          entryType,
          entryItemId,
        },
      });
    },
    [cvId, entryType, deleteEntryItemMutation]
  );

  const handleAddEntry = useCallback(
    // eslint-disable-next-line -- todo fix types
    async (entryData?: { positionIndex?: number; [key: string]: any }) => {
      // TODO: fix hui here
      const variables = {
        cvId,
        entryType,
      };

      if (entryData) {
        const fieldMap = {
          [CvEntryType.WorkExperience]: 'workExperienceData',
          [CvEntryType.Skill]: 'skillData',
          [CvEntryType.Education]: 'educationData',
          [CvEntryType.Project]: 'projectData',
          [CvEntryType.ContactInfo]: 'contactInfoData',
        } as const;

        const fieldName = fieldMap[entryType];
        if (fieldName) {
          // @ts-ignore error here
          variables[fieldName] = entryData;
        }
      }

      const res = await generateNewEntryItemMutation({
        variables,
      });

      const newEntries = res.data?.generateNewEntryItem?.[entryFieldName];

      if (!newEntries?.length) {
        return;
      }
      setEntries(sortByPosition([...newEntries]) as typeof entries);
    },
    [cvId, entryType, entryFieldName, generateNewEntryItemMutation]
  );

  const moveUp = useCallback(
    async (entryId: string) => {
      const currentIndex = entries.findIndex((e) => e._id === entryId);
      if (currentIndex <= 0) return;

      const prevIndex = currentIndex - 1;
      const currentEntry = entries[currentIndex];
      const prevEntry = entries[prevIndex];

      const newEntries = entries.map((entry, index) => {
        if (index === currentIndex) {
          return { ...entry, positionIndex: prevEntry.positionIndex };
        }
        if (index === prevIndex) {
          return { ...entry, positionIndex: currentEntry.positionIndex };
        }
        return entry;
      });
      setEntries(sortByPosition(newEntries as CvEntryItem[]) as typeof entries);

      await updateCv({
        variables: {
          cvId,
          data: {
            [entryFieldName]: [
              { _id: currentEntry._id, positionIndex: prevEntry.positionIndex },
              { _id: prevEntry._id, positionIndex: currentEntry.positionIndex },
            ],
          },
        },
      });
    },
    [entries, cvId, entryFieldName, updateCv]
  );

  const moveDown = useCallback(
    async (entryId: string) => {
      const currentIndex = entries.findIndex((e) => e._id === entryId);
      if (currentIndex === -1 || currentIndex >= entries.length - 1) return;

      const nextIndex = currentIndex + 1;
      const currentEntry = entries[currentIndex];
      const nextEntry = entries[nextIndex];

      const newEntries = entries.map((entry, index) => {
        if (index === currentIndex) {
          return { ...entry, positionIndex: nextEntry.positionIndex };
        }
        if (index === nextIndex) {
          return { ...entry, positionIndex: currentEntry.positionIndex };
        }
        return entry;
      });
      setEntries(sortByPosition(newEntries as CvEntryItem[]) as typeof entries);

      await updateCv({
        variables: {
          cvId,
          data: {
            [entryFieldName]: [
              { _id: currentEntry._id, positionIndex: nextEntry.positionIndex },
              { _id: nextEntry._id, positionIndex: currentEntry.positionIndex },
            ],
          },
        },
      });
    },
    [entries, cvId, entryFieldName, updateCv]
  );

  return {
    entries,
    loading,
    updateField,
    removeEntry,
    handleAddEntry,
    moveUp,
    moveDown,
  };
}
