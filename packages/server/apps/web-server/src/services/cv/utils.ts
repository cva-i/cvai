import { Types } from 'mongoose';
import values from 'lodash/values';

/**
 * Generates a unique `_id` string.
 */
const generateId = (): string => new Types.ObjectId().toString();

/**
 * Converts an array of entries into a PJO, automatically assigning unique `_id`s.
 * @param entries Array of entry objects
 * @returns An object with `_id` as keys and entry objects with `_id` included as values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const arrayToMap = <T extends Record<string, any>>(
  entries: T[]
): Record<string, T & { _id: string; positionIndex: number }> => {
  return Object.fromEntries(
    entries.map((entry, idx) => {
      const id = generateId();
      return [
        id,
        {
          _id: id,
          positionIndex: idx,
          ...entry,
        },
      ];
    })
  );
};

export const mapToArray = <T>(
  map: Map<string, T> | Record<string, T> | undefined
): T[] =>
  map ? Array.from(map instanceof Map ? map.values() : values(map)) : [];

/**
 * Normalizes skills field to always be an array.
 * Handles cases where skills might be stored as a string or other non-array value.
 */
const normalizeSkills = (skills: unknown): string[] | null => {
  if (skills == null) return null;
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') {
    // If it's a comma-separated string, split it
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return null;
};

/**
 * Normalizes entry data to ensure all fields have the expected types.
 * This handles legacy data that might have been stored in different formats.
 */
export const normalizeEntryData = <T>(entry: T): T => {
  if (entry == null || typeof entry !== 'object') return entry;

  const normalized = { ...entry } as Record<string, unknown>;

  // Normalize skills field if it exists
  if ('skills' in normalized) {
    normalized.skills = normalizeSkills(normalized.skills);
  }

  return normalized as T;
};

/**
 * Converts a map to array and normalizes each entry's data.
 */
export const mapToArrayNormalized = <T>(
  map: Map<string, T> | Record<string, T> | undefined
): T[] => {
  const arr = mapToArray(map);
  return arr.map(normalizeEntryData);
};
