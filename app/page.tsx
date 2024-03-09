'use client';

import { useContext } from 'react';
import { Button, Center } from '@mantine/core';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
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
          <Center mih="10rem" mt="5rem">
            <Button
              component="a"
              href="/onboarding"
              variant="outline"
              color="lime"
              size="md"
              radius="xl"
            >
              Get Started
            </Button>
          </Center>
        </>
      )}
    </>
  );
}
