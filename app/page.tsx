import { Button, Center } from '@mantine/core';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Center mih="10rem" mt="5rem">
        <Button
          component="a"
          href="/onboarding"
          variant="outline"
          color="lime"
          size="md"
          radius="xl"
        >
          Get Started
        </Button>
      </Center>
    </>
  );
}
