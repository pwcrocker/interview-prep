'use client';

import { Container, Divider, Loader, Stack, Text } from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0/client';
import QuizOverviews from '@/components/Profile/QuizOverviews';

export default function ProfilePage() {
  const { isLoading } = useUser();

  return isLoading ? (
    <Loader />
  ) : (
    <Stack align="center">
      <Text
        fw={900}
        fz="2.5rem"
        variant="gradient"
        ta="center"
        gradient={{ from: 'burntorange.0', to: 'yellow' }}
      >
        Profile
      </Text>
      <Container w="100%">
        <Divider size="xl" />
      </Container>
      <QuizOverviews />
    </Stack>
  );
}
