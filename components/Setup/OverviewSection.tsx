import { Select, TextInput } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { EXPERIENCE } from '@/types/experience';

export default function OverviewSection({
  jobInputProps,
  expInputProps,
}: {
  jobInputProps: GetInputPropsReturnType;
  expInputProps: GetInputPropsReturnType;
}) {
  return (
    <>
      <TextInput
        label="What profession are you applying for?"
        placeholder="i.e. Software Engineer"
        {...jobInputProps}
      />
      <Select
        label="What experience level?"
        data={[...Object.values(EXPERIENCE)]}
        defaultValue={EXPERIENCE.INTERMEDIATE}
        allowDeselect={false}
        {...expInputProps}
      />
    </>
  );
}
