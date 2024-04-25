import { Box, Stack, Text } from '@mantine/core';
import { ProposedQuizAttributes } from '@/types/quiz';

export default function PayloadBody({
  subject_area,
  difficulty_modifier,
  num_topics,
  ques_per_topic,
  included_topics_arr,
  excluded_topics_arr,
  exclusive_topics_arr,
}: ProposedQuizAttributes) {
  return (
    <Stack>
      <Box>
        <Text span fs="italic">
          Profession
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${subject_area}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Experience
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${difficulty_modifier}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Number of Topics
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${num_topics}`}</Text>
      </Box>
      <Box>
        <Text span fs="italic">
          Questions per Topic
        </Text>
        <Text span c="burntorange.0" fw={700}>{`: ${ques_per_topic}`}</Text>
      </Box>

      {included_topics_arr?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Included Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${included_topics_arr.join(', ')}`}
          </Text>
        </Box>
      )}
      {excluded_topics_arr?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Excluded Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${excluded_topics_arr.join(', ')}`}
          </Text>
        </Box>
      )}
      {exclusive_topics_arr?.length > 0 && (
        <Box>
          <Text span fs="italic">
            Exclusive Focus Areas
          </Text>
          <Text span c="burntorange.0" fw={700}>
            {`: ${exclusive_topics_arr.join(', ')}`}
          </Text>
        </Box>
      )}
    </Stack>
  );
}
