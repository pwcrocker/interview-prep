'use client';

import { useContext, useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { QuizContext } from '@/store/QuizContextProvider';
import Quiz from '@/components/Quiz/Quiz';

export default function QuizLayoutPage({ children }: { children: JSX.Element }) {
  const { quiz } = useContext(QuizContext);
  const pathname = usePathname();

  if (quiz.quiz_questions?.length === 0) {
    redirect('/setup');
    return null;
  }

  useEffect(() => {
    if (quiz.is_graded && pathname !== '/prep/results') {
      redirect('/prep/results');
    }
  }, [pathname]);

  return <Quiz>{children}</Quiz>;
}
