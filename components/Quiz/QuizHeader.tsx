import { Stack, Text } from '@mantine/core';
import ProgressBar from '../Layout/ProgressBar';
import { Nullable } from '@/types/nullability';

interface QuizHeaderProps {
  job: Nullable<string>;
  experience: Nullable<string>;
  totalQuestions: number;
  curQuesIdx: number;
}

export default function QuizHeader({
  job,
  experience,
  totalQuestions,
  curQuesIdx,
}: QuizHeaderProps) {
  return (
    <Stack align="center" mt="xl">
      <Text fs="italic">{job}</Text>
      <Text fs="italic">{experience}</Text>
      {curQuesIdx < totalQuestions && <ProgressBar total={totalQuestions} current={curQuesIdx} />}
    </Stack>
  );
}
