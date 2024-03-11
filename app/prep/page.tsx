'use client';

import { useContext } from 'react';
import { redirect } from 'next/navigation';
import Quiz from '@/components/Quiz/Quiz';
import { QuizContext } from '@/store/QuizContextProvider';

export default function QuizPage() {
  const { quiz } = useContext(QuizContext);

  if (quiz.questions?.length === 0) {
    redirect('/onboarding');
    return null;
  }

  return <Quiz />;
}
