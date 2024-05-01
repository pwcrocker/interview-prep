import { Button, Group, LoadingOverlay } from '@mantine/core';

interface QuizButtonGroupProps {
  showPrev: boolean;
  // isSubmittable: boolean;
  handlePrev: () => void;
  handleNext: () => void;
}

export default function QuizButtonGroup({
  showPrev,
  // isSubmittable,
  handlePrev,
  handleNext,
}: QuizButtonGroupProps) {
  return (
    <Group>
      {showPrev && (
        <Button variant="default" onClick={handlePrev}>
          Prev
        </Button>
      )}
      {/* <Button color="burntorange.0" onClick={handleNext} disabled={!isSubmittable}> */}
      <Button color="burntorange.0" onClick={handleNext}>
        <LoadingOverlay
          // visible={!isSubmittable}
          zIndex={1000}
          overlayProps={{ radius: 'xs', blur: 2 }}
          loaderProps={{ size: 20 }}
        />
        Next
      </Button>
    </Group>
  );
}
