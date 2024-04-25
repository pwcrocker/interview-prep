import { Select, TextInput } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { DIFFICULTY_LEVELS, PROFESSION_BASED_VALUES } from '@/types/difficulty';

export default function OverviewSection({
  subjectAreaInputProps,
  difficultyModifierInputProps,
}: {
  subjectAreaInputProps: GetInputPropsReturnType;
  difficultyModifierInputProps: GetInputPropsReturnType;
}) {
  return (
    <>
      <TextInput
        label="What profession are you applying for?"
        placeholder="i.e. Software Engineer"
        maxLength={30}
        {...subjectAreaInputProps}
      />
      <Select
        label="What experience level?"
        data={[...Object.values(PROFESSION_BASED_VALUES)]}
        defaultValue={PROFESSION_BASED_VALUES[DIFFICULTY_LEVELS.INTERMEDIATE]}
        allowDeselect={false}
        {...difficultyModifierInputProps}
      />
    </>
  );
}
