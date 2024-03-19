'use client';

import { Button, Center } from '@mantine/core';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <Center mih="10rem">
        <Button
          component="a"
          href="/setup"
          variant="gradient"
          gradient={{ from: 'orange', to: 'pink', deg: 236 }}
          size="lg"
          radius="xl"
        >
          Get Started
        </Button>
      </Center>
    </>
  );
}
