import { Stack, Text } from '@mantine/core';
import ProgressBar from '../Layout/ProgressBar';

interface QuizHeaderProps {
  subjectArea: string;
  difficultyModifier: string;
  totalQuestions: number;
  curQuesIdx: number;
}

export default function QuizHeader({
  subjectArea,
  difficultyModifier,
  totalQuestions,
  curQuesIdx,
}: QuizHeaderProps) {
  return (
    <Stack align="center" mt="xl">
      <Text fs="italic">{subjectArea}</Text>
      <Text fs="italic">{difficultyModifier}</Text>
      {curQuesIdx < totalQuestions && <ProgressBar total={totalQuestions} current={curQuesIdx} />}
    </Stack>
  );
}
