import { Stack, Text } from '@mantine/core';

export default function PayloadHeader() {
  return (
    <Stack mb="xl">
      <Text size="lg" fw={700}>
        Everything appear correct?
      </Text>
      <Text size="sm" fs="italic">
        If you submitted topic curation, make sure it&apos;s listed below. Otherwise, you may need
        to go back and press ENTER to submit.
      </Text>
    </Stack>
  );
}
