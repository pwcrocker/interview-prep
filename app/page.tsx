'use client';

import { useContext } from 'react';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import StepForm from '@/components/StepForm/StepForm';
import { QuizContext } from '@/store/QuizContextProvider';
import Quiz from '@/components/Quiz/Quiz';

export default function HomePage() {
  const { quiz } = useContext(QuizContext);
  return (
    <>
      {quiz.questions?.length ? (
        <Quiz />
      ) : (
        <>
          <Welcome />
          <ColorSchemeToggle />
          <StepForm />
        </>
      )}
    </>
  );
}
