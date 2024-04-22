'use client';

import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCoins } from '@tabler/icons-react';
import CreditModal from '../Modals/CreditModal';

export default function CreditButton({ numOfCredits }: { numOfCredits: number }) {
  const [creditOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <CreditModal opened={creditOpened} close={close} />
      {numOfCredits > 0 ? (
        <Button leftSection={<IconCoins size={14} />} variant="default" onClick={open}>
          {numOfCredits}
        </Button>
      ) : (
        <Button leftSection={<IconCoins size={14} />} variant="default" onClick={open}>
          Buy Credits
        </Button>
      )}
    </>
  );
}
