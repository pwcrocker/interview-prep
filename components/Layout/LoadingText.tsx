import { Box, Flex, Progress, Text } from '@mantine/core';

export default function LoadingText({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <Flex direction="column" align="center" gap="2rem" {...props}>
      <Text ta="center" fw={700} size="xl">
        {label}
      </Text>
      <Box w="80%">
        <Progress value={100} animated />
      </Box>
    </Flex>
  );
}
