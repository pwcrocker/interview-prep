import { Button, Tooltip } from '@mantine/core';

interface PromptSubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  tooltip?: string;
  clickHandler: () => void;
}

export default function PromptSubmitButton({
  loading,
  disabled,
  clickHandler,
  tooltip,
}: PromptSubmitButtonProps) {
  return (
    <>
      {disabled ? (
        <Tooltip label={tooltip}>
          <Button data-disabled onClick={(event) => event.preventDefault()} loading={loading}>
            Yes, Let&apos;s Begin
          </Button>
        </Tooltip>
      ) : (
        <Button color="burntorange.0" onClick={clickHandler} loading={loading}>
          Yes, Let&apos;s Begin
        </Button>
      )}
    </>
  );
}
