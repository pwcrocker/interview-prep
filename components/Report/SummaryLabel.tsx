import { Group, Text } from '@mantine/core';
import Rating from './Rating';

export default function SummaryLabel({ summary }: { summary: string }) {
  return (
    <Group mt="1rem">
      <Text span fw={700}>
        Answer Rating:{' '}
      </Text>
      <Rating analysisSummary={summary} />
    </Group>
  );
}
