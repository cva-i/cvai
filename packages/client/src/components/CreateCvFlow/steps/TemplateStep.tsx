import { useGetCvsQuery } from '../../../generated/graphql';
import { useMemo } from 'react';
import { SelectList, Typography } from '../../atoms';
import { useCvCreationFlow } from '../../../contexts';

// TODO: add loading and error states. maybe
export const TemplateStep = () => {
  const { data: { getCvs: _resumeList = [] } = {} } = useGetCvsQuery({
    fetchPolicy: 'cache-only',
  });
  const { templateId, setTemplateId } = useCvCreationFlow();

  const resumeList = useMemo(
    () => _resumeList.map(({ _id, name }) => ({ id: _id, label: name })),
    [_resumeList]
  );

  return (
    <div className="flex flex-col gap-6">
      <SelectList
        label={'CV Template'}
        items={resumeList}
        onSelect={setTemplateId}
        defaultState={templateId}
      />

      <Typography variant="body2" color="secondary">
        Creating from scratch is currently unavailable
      </Typography>
    </div>
  );
};
