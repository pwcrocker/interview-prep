'use client';

import { useContext } from 'react';
import { Accordion } from '@mantine/core';
import { QuizContext } from '@/store/QuizContextProvider';
import ReportItem from './ReportItem';

export default function Report() {
  const { quiz } = useContext(QuizContext);

  // TODO really hacking these types now
  const items = quiz.quiz_questions.map((qq, idx) => (
    <ReportItem key={`repoitem${idx}`} idx={idx} quiz_question={qq} />
  ));

  return (
    <Accordion chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}
