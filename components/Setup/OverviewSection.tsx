import { Select, TextInput } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { PROFESSION_LABELS, QUIZ_DIFFICULTY } from '@/types/enum';

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
      {/* onChange will override onChange from props spread */}
      <Select
        label="What experience level?"
        data={Object.values(PROFESSION_LABELS)}
        defaultValue={PROFESSION_LABELS[QUIZ_DIFFICULTY.INTERMEDIATE]}
        allowDeselect={false}
        {...difficultyModifierInputProps}
        // onChange={handleDifficultyChange}
      />
    </>
  );
}
