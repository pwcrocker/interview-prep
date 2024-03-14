import { Container, Progress, Text } from '@mantine/core';

interface QuizProgressProps {
  totalQuesNum: number;
  curQuesNum: number;
}

export default function QuizProgress({ totalQuesNum, curQuesNum }: QuizProgressProps) {
  return (
    <Container w="50%">
      {curQuesNum >= totalQuesNum && (
        <>
          <Text>Progress:</Text>
          <Progress value={(curQuesNum / totalQuesNum) * 100} />
        </>
      )}
    </Container>
  );
}
