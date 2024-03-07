'use client';

import { useContext, useState } from 'react';
import { Button, Container, Flex, Text, Textarea } from '@mantine/core';
import { QuizContext } from '@/store/QuizContextProvider';
import { Question } from '@/types/quiz';

function Question({ question, onNext }: { question: Question; onNext: () => void }) {
  const [curAnswer, setCurAnswer] = useState('');
  return (
    <Container size="xs">
      <Flex gap="xl" direction="column" mt="xl">
        <Text fw={700}>{question.attributes.topic}</Text>
        <Text fw={700}>{question.question}</Text>
        <Textarea
          autosize
          minRows={4}
          value={curAnswer}
          onChange={(e) => setCurAnswer(e.target.value)}
        />
        <Button onClick={onNext}>Submit</Button>
      </Flex>
    </Container>
  );
}

export default function Quiz() {
  const { quiz } = useContext(QuizContext);
  const [curIdx, setCurIdx] = useState(0);

  function handleNext() {
    setCurIdx((prevIdx) => prevIdx + 1);
  }

  return <Question question={quiz.questions[curIdx]} onNext={handleNext} />;
}
