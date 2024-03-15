'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mantine/core';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter();
  useEffect(() => {
    // TODO
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container size="xl" ta="center">
      <h2>Something went wrong!</h2>
      <button type="submit" onClick={() => router.push('/')}>
        Back to Home
      </button>
    </Container>
  );
}
