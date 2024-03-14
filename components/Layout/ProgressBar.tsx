import { Container, Progress, Text } from '@mantine/core';

interface ProgressBarProps {
  total: number;
  current: number;
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <>
      {current <= total && (
        <Container w="50%">
          <Text>Progress:</Text>
          <Progress value={(current / total) * 100} />
        </Container>
      )}
    </>
  );
}
