'use client';

import { useContext } from 'react';
import { redirect } from 'next/navigation';
import { Stack } from '@mantine/core';
import { QuizContext } from '@/store/QuizContextProvider';
import ReportHeader, { SummaryCounts } from '@/components/Report/ReportHeader';
import NewReport from '@/components/Report/NewReport';
import { Quiz } from '@/types/quiz';

function getSummaryCounts(quiz: Quiz) {
  const counts: SummaryCounts = {
    great: 0,
    good: 0,
    improve: 0,
  };
  quiz.questions.forEach((ques) => {
    const summary = ques.analysis?.summary.toLowerCase() || '';
    if (summary.includes('great')) {
      counts.great += 1;
    } else if (summary.includes('good')) {
      counts.good += 1;
    } else if (summary.includes('improve')) {
      counts.improve += 1;
    }
  });
  return counts;
}

export default function ReportPage() {
  const { quiz } = useContext(QuizContext);
  const summaryCounts = getSummaryCounts(quiz);

  if (quiz.questions?.length === 0) {
    redirect('/setup');
    return null;
  }

  return (
    <Stack gap="xl">
      <ReportHeader counts={summaryCounts} />
      <NewReport />
    </Stack>
  );
}
