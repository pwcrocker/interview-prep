import { Button, Stack, Title } from '@mantine/core';

export default function ReportHeader() {
  return (
    <Stack align="center" gap="md">
      <Title>Results</Title>
      {/* <Group c="dimmed">
        <Text>Great: {great}</Text>
        <Text>Good: {good}</Text>
        <Text>Improve: {improve}</Text>
      </Group> */}
      <Button size="md" variant="outline" color="#FF8C00" component="a" href="/setup">
        Back to Setup
      </Button>
    </Stack>
  );
}
