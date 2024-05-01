'use client';

import { Text, Textarea } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import { QuestionDAO } from '@/types/dao';
import QuizButtonGroup from './QuizButtonGroup';

const MAX_TEXTAREA_LEN = 500;
const QUES_ID_PATH_IDX = 3;

export default function QuizQuestion() {
  const router = useRouter();
  const { quiz, dispatch } = useContext(QuizContext);
  const [quesAnswered, setQuesAnswered] = useState(false);
  const [curAnswer, setCurAnswer] = useState('');
  const pathname = usePathname();
  const questionIdx = quiz.quiz_questions.findIndex(
    (ques) => ques.ques_id === pathname.split('/')[QUES_ID_PATH_IDX]
  );

  const isDone = useCallback(() => questionIdx >= quiz.quiz_questions.length - 1, [questionIdx]);

  useEffect(() => {
    if (quesAnswered) {
      if (isDone()) {
        router.push('/prep/confirm');
      } else {
        router.push(`/prep/question/${quiz.quiz_questions[questionIdx + 1].ques_id}`);
      }
    }
  }, [quiz]);

  useEffect(() => {
    const userAnswer = quiz.quiz_questions[questionIdx]?.question_answer;
    if (userAnswer?.user_answer) {
      setCurAnswer(userAnswer.user_answer);
    } else {
      setCurAnswer('');
    }
  }, []);

  function handleAnswerChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCurAnswer(event.target.value);
  }

  const cleanAnswer = (userAnswer: string) =>
    userAnswer.length > MAX_TEXTAREA_LEN ? userAnswer.substring(0, MAX_TEXTAREA_LEN) : userAnswer;

  function handlePrev() {
    router.push(`/prep/question/${quiz.quiz_questions[questionIdx - 1].ques_id}`);
  }

  function handleNext() {
    const answerStr = cleanAnswer(curAnswer);
    const curQuestion = quiz.quiz_questions[questionIdx] as QuestionDAO;
    const newAnswer = {
      ques_id: curQuestion.ques_id,
      ques_text: curQuestion.ques_text,
      user_answer: answerStr,
    };
    dispatch({
      type: QuizActionType.ANSWER_SINGLE_QUESTION,
      payload: { questionIdx, answer: newAnswer },
    });
    setQuesAnswered(true);
  }

  return (
    <>
      <Text fs="italic">{quiz.quiz_questions[questionIdx].ques_topic}</Text>
      <Text fw={700}>{quiz.quiz_questions[questionIdx].ques_text}</Text>
      <Textarea
        autosize
        minRows={4}
        maxLength={MAX_TEXTAREA_LEN}
        description={`(${curAnswer.length}/${MAX_TEXTAREA_LEN} characters)`}
        value={curAnswer}
        onChange={handleAnswerChange}
      />
      <QuizButtonGroup showPrev={questionIdx > 0} handlePrev={handlePrev} handleNext={handleNext} />
    </>
  );
}
