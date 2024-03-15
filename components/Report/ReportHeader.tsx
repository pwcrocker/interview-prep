import { Button, Group, Stack, Text, Title } from '@mantine/core';

export interface SummaryCounts {
  great: number;
  good: number;
  improve: number;
}

interface ReportHeaderProps {
  counts: SummaryCounts;
}

export default function ReportHeader({ counts: { great, good, improve } }: ReportHeaderProps) {
  return (
    <Stack align="center" gap="md">
      <Title>Results</Title>
      <Group c="dimmed">
        <Text>Great: {great}</Text>
        <Text>Good: {good}</Text>
        <Text>Improve: {improve}</Text>
      </Group>
      <Button size="md" variant="outline" color="#FF8C00" component="a" href="/setup">
        Back to Setup
      </Button>
    </Stack>
  );
}
