'use client';

import { useContext } from 'react';
import { Accordion } from '@mantine/core';
import { QuizContext } from '@/store/QuizContextProvider';
import ReportItem from './ReportItem';

export default function Report() {
  const { quiz } = useContext(QuizContext);

  const items = quiz.questions.map((question, idx) => <ReportItem idx={idx} question={question} />);

  return (
    <Accordion chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}
