import { useMemo } from 'react';
import { ColumnLayout } from '../atoms';
import { Typography } from '../atoms/Typography/Typography';
import { SectionChangeDisplay } from './SectionChangeDisplay';
import {
  compareAboutMe,
  compareContactInfo,
  compareCvTitle,
  compareEducation,
  compareName,
  compareProjects,
  compareSkills,
  compareWorkExperience,
} from './comparators';
import type { VersionComparisonContentProps } from './types';

export const VersionComparisonContent = ({
  left,
  right,
}: VersionComparisonContentProps) => {
  const changes = useMemo(() => {
    return [
      compareCvTitle(left, right),
      compareName(left, right),
      compareAboutMe(left, right),
      compareWorkExperience(left, right),
      compareEducation(left, right),
      compareProjects(left, right),
      compareSkills(left, right),
      compareContactInfo(left, right),
    ].flatMap((x) => (x ? [x] : []));
  }, [left, right]);

  if (changes.length === 0) {
    return (
      <div className="p-4 text-center">
        <Typography variant="h6">
          No differences found between these versions
        </Typography>
      </div>
    );
  }

  return (
    <ColumnLayout className="gap-12 w-full">
      {changes.map((section, idx) => (
        <SectionChangeDisplay
          key={`${section.section}-${idx}`}
          section={section}
        />
      ))}
    </ColumnLayout>
  );
};
