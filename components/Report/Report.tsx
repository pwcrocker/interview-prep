'use client';

import { useContext } from 'react';
import { Accordion } from '@mantine/core';
import { QuizContext } from '@/store/QuizContextProvider';
import AccordionItem from './AccordionItem';

export default function Report() {
  const { quiz } = useContext(QuizContext);

  const items = quiz.questions.map((question, idx) => (
    <AccordionItem idx={idx} question={question} />
  ));

  return (
    <Accordion chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}
