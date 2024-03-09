import { Container, Skeleton, Text } from '@mantine/core';

export default function ReportSkeleton() {
  return (
    <Container size="sm" mt="xl" bg="rgba(0, 0, 0, .3)">
      <Text>Finalizing results...</Text>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Container>
  );
}
