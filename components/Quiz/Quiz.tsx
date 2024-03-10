'use client';

/* eslint-disable no-console */

import { useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Container, Flex, Text, Textarea } from '@mantine/core';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { Question } from '@/types/quiz';
import { checkAnswer } from '@/lib/prompt';
import LoadingText from '../Layout/LoadingText';

function Question({
  question,
  handleNext,
}: {
  question: Question;
  handleNext: (userAnswer: string) => void;
}) {
  const [curAnswer, setCurAnswer] = useState('');

  function processSubmit() {
    handleNext(curAnswer);
    setCurAnswer('');
  }

  return (
    <Container size="xs">
      <Flex gap="xl" direction="column" mt="xl" p="md" bg="rgba(0, 0, 0, .3)">
        <Text fs="italic">Topic: {question.attributes.topic}</Text>
        <Text fw={700}>Question: {question.question}</Text>
        <Textarea
          autosize
          minRows={4}
          value={curAnswer}
          onChange={(e) => setCurAnswer(e.currentTarget.value)}
        />
        <Button onClick={processSubmit}>Submit</Button>
      </Flex>
    </Container>
  );
}

export default function Quiz() {
  const { quiz, dispatch } = useContext(QuizContext);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isDone = useCallback(() => {
    console.log(`index: ${questionIdx}`);
    console.log(`questions: ${JSON.stringify(quiz.questions, null, 2)}`);
    return questionIdx >= quiz.questions.length;
  }, [questionIdx]);

  useEffect(() => {
    if (isDone() && !isFetching) {
      router.push(`${pathname}/results`);
    }
  }, [isDone, isFetching]);

  useEffect(() => {
    console.log(`pathname ${pathname}`);
  }, [pathname]);

  function handleNext(userAnswer: string) {
    setIsFetching(true);
    checkAnswer({ question: quiz.questions[questionIdx].question, userAnswer }).then((res) => {
      dispatch({
        type: QuizActionType.ADD_ANALYSIS,
        payload: { question: quiz.questions[questionIdx].question, questionAnalysis: res },
      });
      setIsFetching(false);
    });
    dispatch({
      type: QuizActionType.ANSWER_QUESTION,
      payload: { questionIdx, userAnswer },
    });
    setQuestionIdx((prevIdx) => prevIdx + 1);
  }

  return (
    <>
      {!isDone() && <Question question={quiz.questions[questionIdx]} handleNext={handleNext} />}
      {isDone() && <LoadingText label="Loading results..." mt="3rem" />}
    </>
  );
}
