import { Group, Text } from '@mantine/core';
import Rating from './Rating';

export default function RatingLabel({ rating }: { rating: number }) {
  return (
    <Group mt="1rem" gap="xs">
      <Text span>Answer Rating:</Text>
      <Rating rating={rating} />
    </Group>
  );
}
