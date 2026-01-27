import { ColumnLayout } from '../atoms';
import { Typography } from '../atoms/Typography/Typography';
import { ItemChangeDisplay } from './ItemChangeDisplay';
import type { SectionChange } from './types';

type SectionChangeDisplayProps = {
  section: SectionChange;
};

export const SectionChangeDisplay = ({
  section,
}: SectionChangeDisplayProps) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <Typography variant="h6" className="mb-2">
      {section.section}
    </Typography>

    <ColumnLayout className="gap-8">
      {section.items.map((item, idx) => (
        <ItemChangeDisplay
          key={`${item.name}-${idx}`}
          item={item}
          isLast={idx === section.items.length - 1}
        />
      ))}
    </ColumnLayout>
  </div>
);
