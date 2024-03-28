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
          gradient={{ from: 'burntorange.0', to: 'yellow', deg: 130 }}
          size="lg"
          radius="xl"
        >
          Get Started
        </Button>
      </Center>
    </>
  );
}
