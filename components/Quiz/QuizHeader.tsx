import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Stack, Text } from '@mantine/core';
import ProgressBar from '../Layout/ProgressBar';
import { QuizContext } from '@/store/QuizContextProvider';

export default function QuizHeader() {
  const { quiz } = useContext(QuizContext);
  const pathname = usePathname();
  const curQuesIdx = pathname?.includes('/question/')
    ? quiz.quiz_questions.findIndex((ques) => ques.ques_id === pathname.split('/')[3])
    : quiz.quiz_questions.length;

  return (
    <Stack align="center" mt="md">
      <Text fs="italic">{quiz.subject_area}</Text>
      <Text fs="italic">{quiz.difficulty}</Text>
      {curQuesIdx < quiz.quiz_questions.length && (
        <ProgressBar total={quiz.quiz_questions.length} current={curQuesIdx} />
      )}
    </Stack>
  );
}
