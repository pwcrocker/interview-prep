'use client';

import { useContext } from 'react';
import { redirect } from 'next/navigation';
import { Title } from '@mantine/core';
import SplitQuiz from '@/components/Quiz/SplitQuiz';
import { QuizContext } from '@/store/QuizContextProvider';

export default function QuizPage() {
  const { quiz } = useContext(QuizContext);

  if (quiz.questions?.length === 0) {
    redirect('/setup');
    return null;
  }

  return (
    <>
      <Title ta="center">Prep Session</Title>
      <SplitQuiz />
    </>
  );
}
