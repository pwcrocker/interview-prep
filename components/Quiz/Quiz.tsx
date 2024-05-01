'use client';

import { Container, Flex, Title } from '@mantine/core';
import QuizHeader from './QuizHeader';

// const SUBMIT_DELAY = 4000;

export default function Quiz({ children }: { children: JSX.Element }) {
  return (
    <>
      <Title ta="center">Prep Session</Title>
      <QuizHeader />
      <Container size="md">
        <Flex gap="xl" direction="column" mt="xl" p="md" bg="rgba(0, 0, 0, .1)">
          {children}
        </Flex>
      </Container>
    </>
  );
}
