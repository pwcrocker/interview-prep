'use client';

import { useContext } from 'react';
import { redirect } from 'next/navigation';
import Report from '@/components/Report/Report';
import { QuizContext } from '@/store/QuizContextProvider';

export default function ReportPage() {
  const { quiz } = useContext(QuizContext);

  if (quiz.questions?.length === 0) {
    redirect('/onboarding');
    return null;
  }

  return <Report />;
}
