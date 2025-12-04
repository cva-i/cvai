import { match, P } from 'ts-pattern';
import type { GetCvQuery } from '../../../../generated/graphql';

/**
 * Converts various field value types to string
 */
export function fieldValueToString(value: unknown): string {
  return match(value)
    .with(P.string, (str) => str)
    .with(P.array(P.any), (arr) => arr.join(', '))
    .with(P.nullish, () => '')
    .otherwise((val) => String(val));
}

export function extractCurrentText(
  cvData: GetCvQuery | undefined,
  blockId: string
): string | null {
  if (!cvData?.getCv) return null;

  const cv = cvData.getCv;

  const mappingPath = cv.metadata?.reverseIdMapping[blockId];

  if (!mappingPath) return null;
  const pathParts = mappingPath.split('.');
  let current: any = cv;
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else if (Array.isArray(current)) {
      current = current.find((it) => it._id === part);
    } else {
      current = null;
      break;
    }
  }
  return fieldValueToString(current);
}
