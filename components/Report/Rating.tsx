'use client';

import { Text } from '@mantine/core';
import { GRADE_LABELS } from '@/types/enum';

export default function Rating({ rating }: { rating: number }) {
  return <Text fw={700}>{GRADE_LABELS[rating]}</Text>;
}
