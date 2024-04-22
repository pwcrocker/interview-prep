'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Flex } from '@mantine/core';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { gradeQuiz } from '@/lib/prompt';
import LoadingText from '../Layout/LoadingText';
import QuizHeader from './QuizHeader';
import { logErr, logJson } from '@/lib/logger';
import QuizQuestion from './QuizQuestion';
import QuizButtonGroup from './QuizButtonGroup';
import FinalQuizSubmit from './FinalQuizSubmit';

const MAX_TEXTAREA_LEN = 500;
const SUBMIT_DELAY = 4000;

const cleanAnswer = (userAnswer: string) =>
  userAnswer.length > MAX_TEXTAREA_LEN ? userAnswer.substring(0, MAX_TEXTAREA_LEN) : userAnswer;

export default function Quiz() {
  const { quiz, dispatch } = useContext(QuizContext);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [curAnswer, setCurAnswer] = useState('');
  const [isSubmittable, setIsSubmittable] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hasFetched) {
      router.push(`${pathname}/results`);
    }
  }, [hasFetched]);

  const isDone = useCallback(() => questionIdx >= quiz.questions.length, [questionIdx]);

  useEffect(() => {
    // prevent submit spam
    setIsSubmittable(false);
    setTimeout(() => setIsSubmittable(true), SUBMIT_DELAY);
    if (!isDone() && quiz.questions[questionIdx].userAnswer) {
      setCurAnswer(quiz.questions[questionIdx].userAnswer || '');
    } else {
      setCurAnswer('');
    }
  }, [questionIdx, isDone]);

  function handlePrev() {
    setQuestionIdx((prevIdx) => prevIdx - 1);
  }

  function handleNext() {
    const userAnswer = cleanAnswer(curAnswer);
    dispatch({
      type: QuizActionType.ANSWER_SINGLE_QUESTION,
      payload: { questionId: quiz.questions[questionIdx].id, userAnswer },
    });
    setQuestionIdx((prevIdx) => prevIdx + 1);
  }

  async function handleSubmit() {
    setIsFetching(true);
    return gradeQuiz(
      quiz.questions.map(({ id, question, userAnswer }) => ({ id, question, userAnswer }))
    )
      .then((gradedQuiz) => {
        logJson('Graded quiz: ', gradedQuiz);
        dispatch({
          type: QuizActionType.GRADE_QUIZ,
          payload: gradedQuiz,
        });
        setHasFetched(true);
      })
      .catch((err) => {
        logErr('Failed to grade quiz: ', err);
        setIsFetching(false);
        throw err;
      });
  }

  return (
    <>
      <QuizHeader
        job={quiz.attributes.profession.job}
        experience={quiz.attributes.profession.experience!.toString()}
        totalQuestions={quiz.questions.length}
        curQuesIdx={questionIdx}
      />
      {!isFetching && (
        <Container size="sm">
          <Flex gap="xl" direction="column" mt="xl" p="md" bg="rgba(0, 0, 0, .1)">
            {!isDone() && (
              <>
                <QuizQuestion
                  topic={quiz.questions[questionIdx].attributes.topic}
                  question={quiz.questions[questionIdx].question}
                  answer={curAnswer}
                  maxLen={MAX_TEXTAREA_LEN}
                  handleChange={setCurAnswer}
                />
                <QuizButtonGroup
                  showPrev={questionIdx > 0}
                  isSubmittable={isSubmittable}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                />
              </>
            )}
            {isDone() && <FinalQuizSubmit handlePrev={handlePrev} handleSubmit={handleSubmit} />}
          </Flex>
        </Container>
      )}
      {isFetching && <LoadingText label="Loading results (takes a few seconds)..." mt="3rem" />}
    </>
  );
}
