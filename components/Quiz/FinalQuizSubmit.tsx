import { Button, Group, Text } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

interface FinalQuizSubmitProps {
  handlePrev: () => void;
  handleSubmit: () => void;
  showPrev?: boolean;
  isSubmittable?: boolean;
}

export default function FinalQuizSubmit({
  handlePrev,
  handleSubmit,
  showPrev = true,
  isSubmittable = true,
}: FinalQuizSubmitProps) {
  return (
    <>
      <Text ta="center" fw={700}>
        Ready for Grading?
      </Text>
      <Group mt="md" justify="center">
        {showPrev && (
          <Button variant="default" onClick={handlePrev}>
            Go Back
          </Button>
        )}
        {isSubmittable && (
          <Button
            color="burntorange.0"
            rightSection={<IconSend size={14} />}
            onClick={handleSubmit}
          >
            Yep, Send It
          </Button>
        )}
      </Group>
    </>
  );
}
