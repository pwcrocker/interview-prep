'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCoins } from '@tabler/icons-react';
import CreditModal from '../Modals/CreditModal';
import { useTokens } from '@/store/TokensContextProvider';

export default function CreditButton() {
  const [creditOpened, { open, close }] = useDisclosure(false);
  const { isLoading } = useUser();
  const { tokens } = useTokens();

  return (
    <>
      <CreditModal opened={creditOpened} close={close} />
      <Button
        loading={isLoading}
        leftSection={<IconCoins size={14} />}
        variant="default"
        onClick={open}
      >
        {tokens}
      </Button>
    </>
  );
}
