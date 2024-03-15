'use client';

/* eslint-disable no-console */

import { useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Container, Flex, LoadingOverlay, Text, Textarea } from '@mantine/core';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { Question } from '@/types/quiz';
import { checkAnswer } from '@/lib/prompt';
import LoadingText from '../Layout/LoadingText';
import QuizHeader from './QuizHeader';

function QuizQuestion({
  question,
  handleNext,
  isSubmittable,
}: {
  question: Question;
  handleNext: (userAnswer: string) => void;
  isSubmittable: boolean;
}) {
  const [curAnswer, setCurAnswer] = useState('');

  function processSubmit() {
    handleNext(curAnswer);
    setCurAnswer('');
  }

  return (
    <Container size="xs">
      <Flex gap="xl" direction="column" mt="xl" p="md" bg="rgba(0, 0, 0, .3)">
        <Text fs="italic">{question.attributes.topic}</Text>
        <Text fw={700}>{question.question}</Text>
        <Textarea
          autosize
          minRows={4}
          value={curAnswer}
          onChange={(e) => setCurAnswer(e.currentTarget.value)}
        />
        <Button onClick={processSubmit} disabled={!isSubmittable}>
          <LoadingOverlay
            visible={!isSubmittable}
            zIndex={1000}
            overlayProps={{ radius: 'xs', blur: 2 }}
            loaderProps={{ size: 20 }}
          />
          Submit
        </Button>
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

  const isDone = useCallback(() => questionIdx >= quiz.questions.length, [questionIdx]);

  useEffect(() => {
    if (isDone() && !isFetching) {
      router.push(`${pathname}/results`);
    }
  }, [isDone, isFetching]);

  function handleNext(userAnswer: string) {
    setIsFetching(true);

    checkAnswer({ question: quiz.questions[questionIdx].question, userAnswer })
      .then((res) => {
        dispatch({
          type: QuizActionType.ADD_ANALYSIS,
          payload: { question: quiz.questions[questionIdx].question, questionAnalysis: res },
        });
        setIsFetching(false);
      })
      .catch((err) => {
        console.error(`Failed to evaluate answer for: ${questionIdx} --- ${err}`);
        dispatch({
          type: QuizActionType.ADD_ANALYSIS,
          payload: {
            question: quiz.questions[questionIdx].question,
            questionAnalysis: { summary: 'Failed', detailed: 'Failed to fetch answer' },
          },
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
      <QuizHeader
        job={quiz.attributes.profession.job}
        experience={quiz.attributes.profession.experience!.toString()}
        totalQuestions={quiz.questions.length}
        curQuesIdx={questionIdx}
      />
      {!isDone() && (
        <QuizQuestion
          question={quiz.questions[questionIdx]}
          handleNext={handleNext}
          isSubmittable={!isFetching}
        />
      )}
      {isDone() && <LoadingText label="Loading results..." mt="3rem" />}
    </>
  );
}
