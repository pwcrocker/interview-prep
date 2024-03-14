import { Button, Stack, Title } from '@mantine/core';

export default function ReportHeader() {
  return (
    <Stack align="center" gap="md">
      <Title>Results</Title>
      <Button component="a" href="/setup">
        Back to Setup
      </Button>
    </Stack>
  );
}
