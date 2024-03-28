import { Container, Progress, Text } from '@mantine/core';

interface ProgressBarProps {
  total: number;
  current: number;
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <Container w="50%">
      <Text>Progress:</Text>
      <Progress color="burntorange.0" value={(current / total) * 100} />
    </Container>
  );
}
