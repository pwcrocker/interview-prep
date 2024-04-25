'use client';

import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Flex } from '@mantine/core';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { gradeQuiz } from '@/lib/prompt';
import LoadingText from '../Layout/LoadingText';
import QuizHeader from './QuizHeader';
import { log, logErr } from '@/lib/logger';
import QuizQuestion from './QuizQuestion';
import QuizButtonGroup from './QuizButtonGroup';
import FinalQuizSubmit from './FinalQuizSubmit';
import { AnsweredQuiz } from '@/types/quiz';

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

  const isDone = useCallback(() => questionIdx >= quiz.quiz_questions.length, [questionIdx]);

  useEffect(() => {
    // prevent submit spam
    setIsSubmittable(false);
    setTimeout(() => setIsSubmittable(true), SUBMIT_DELAY);
    if (!isDone() && quiz.quiz_questions[questionIdx].question_answer?.user_answer) {
      setCurAnswer(quiz.quiz_questions[questionIdx].question_answer?.user_answer || '');
    } else {
      setCurAnswer('');
    }
  }, [questionIdx, isDone]);

  function handlePrev() {
    setQuestionIdx((prevIdx) => prevIdx - 1);
  }

  function handleAnswerChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCurAnswer(event.target.value);
  }

  function handleNext() {
    const answerStr = cleanAnswer(curAnswer);
    // TODO not sure about this force of question_id
    const newAnswer = {
      question_id: quiz.quiz_questions[questionIdx].question_id!,
      user_answer: answerStr,
    };
    dispatch({
      type: QuizActionType.ANSWER_SINGLE_QUESTION,
      payload: { questionIdx, answer: newAnswer },
    });
    setQuestionIdx((prevIdx) => prevIdx + 1);
  }

  async function handleSubmit() {
    setIsFetching(true);
    // TODO is there any other way?
    const persistedAnswers = await gradeQuiz(quiz as AnsweredQuiz);
    if (!persistedAnswers) {
      logErr('Failed to grade quiz: ');
      setIsFetching(false);
      // TODO potential refund or retry flow?
      throw new Error('Failed to grade quiz');
    }
    log('Finished grading quiz: ');
    dispatch({
      type: QuizActionType.GRADE_QUIZ,
      payload: persistedAnswers,
    });
    setHasFetched(true);
  }

  return (
    <>
      <QuizHeader
        subjectArea={quiz.subject_area}
        difficultyModifier={quiz.difficulty_modifier}
        totalQuestions={quiz.quiz_questions.length}
        curQuesIdx={questionIdx}
      />
      {!isFetching && (
        <Container size="sm">
          <Flex gap="xl" direction="column" mt="xl" p="md" bg="rgba(0, 0, 0, .1)">
            {!isDone() && (
              <>
                <QuizQuestion
                  // TODO having to force everywhere because of state Partial
                  topic={quiz.quiz_questions[questionIdx].question_topic!}
                  question={quiz.quiz_questions[questionIdx].question!}
                  answer={curAnswer}
                  maxLen={MAX_TEXTAREA_LEN}
                  handleChange={handleAnswerChange}
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
