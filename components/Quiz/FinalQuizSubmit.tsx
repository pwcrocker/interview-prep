'use client';

import { useContext, useEffect, useState } from 'react';
import { Box, Button, Group, Text } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { gradeQuiz } from '@/lib/prompt';
import { EphemeralUserAnswer } from '@/types/answer';
import { log, logErr } from '@/lib/logger';
import LoadingText from '../Layout/LoadingText';
import { ResponseFetchError } from '@/errors/ResponseFetchError';
import { ResponseParseError } from '@/errors/ResponseParseError';

export default function FinalQuizSubmit() {
  const [isFetching, setIsFetching] = useState(false);
  const [doneFetching, setDoneFetching] = useState(false);
  const router = useRouter();
  const { quiz, dispatch } = useContext(QuizContext);

  useEffect(() => {
    if (doneFetching) {
      router.push('/prep/results');
    }
  }, [doneFetching]);

  useEffect(() => {
    if (isFetching && quiz.quiz_questions[0].question_answer?.summary_analysis) {
      setDoneFetching(true);
    }
  }, [quiz]);

  function handlePrev() {
    router.push(`/prep/question/${quiz.quiz_questions[quiz.quiz_questions.length - 1].ques_id}`);
  }

  async function handleSubmit() {
    setIsFetching(true);
    // TODO is there any other way?
    if (!quiz.quiz_id) {
      throw new Error('No quiz ID to save answers for');
    }

    const persistedAnswers = await gradeQuiz(
      quiz.quiz_id,
      quiz.quiz_questions.map((qq) => qq.question_answer as EphemeralUserAnswer)
    ).catch((err) => {
      if (err instanceof ResponseFetchError || err instanceof ResponseParseError) {
        // Allow the user to try again?
        setIsFetching(false);
      } else {
        throw new Error('Failed to save quiz result');
      }
    });
    if (!persistedAnswers) {
      logErr('Failed to grade quiz: ');
      setIsFetching(false);
      // TODO retry flow?
      throw new Error('Failed to grade quiz');
    } else {
      log('Finished grading quiz: ');
      dispatch({
        type: QuizActionType.GRADE_QUIZ,
        payload: persistedAnswers,
      });
    }
  }

  return (
    <>
      {!isFetching && (
        <>
          <Text ta="center" fw={700}>
            Ready for Grading?
          </Text>
          <Group mt="md" justify="center">
            <Button variant="default" onClick={handlePrev}>
              Go Back
            </Button>
            <Button
              color="burntorange.0"
              rightSection={<IconSend size={14} />}
              onClick={handleSubmit}
            >
              Yep, Send It
            </Button>
          </Group>
        </>
      )}
      {isFetching && (
        <Box pb="xl">
          <LoadingText label="Loading results (takes a few seconds)..." mt="3rem" />
        </Box>
      )}
    </>
  );
}
