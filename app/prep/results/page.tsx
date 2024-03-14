'use client';

import { useContext } from 'react';
import { redirect } from 'next/navigation';
import { Stack } from '@mantine/core';
import Report from '@/components/Report/Report';
import { QuizContext } from '@/store/QuizContextProvider';
import ReportHeader from '@/components/Report/ReportHeader';

export default function ReportPage() {
  const { quiz } = useContext(QuizContext);

  if (quiz.questions?.length === 0) {
    redirect('/setup');
    return null;
  }

  return (
    <Stack gap="xl">
      <ReportHeader />
      <Report />
    </Stack>
  );
}
