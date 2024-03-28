import { Box, Stack, Text } from '@mantine/core';
import { SetupFormValues } from '@/types/setupForm';

export default function PayloadBody({
  job,
  experience,
  topics,
  quesPerTopic,
  includedAreas,
  excludedAreas,
  exclusiveAreas,
}: SetupFormValues) {
  return (
    <Stack>
      <Box>
        <Text span fs="italic">
          Profession
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${job}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Experience
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${experience}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Number of Topics
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${topics}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Questions per Topic
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${quesPerTopic}`}</Text>
      </Box>

      {includedAreas?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Included Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${includedAreas.join(', ')}`}
          </Text>
        </Box>
      )}
      {excludedAreas?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Excluded Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${excludedAreas.join(', ')}`}
          </Text>
        </Box>
      )}
      {exclusiveAreas?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Exclusive Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${exclusiveAreas.join(', ')}`}
          </Text>
        </Box>
      )}
    </Stack>
  );
}
