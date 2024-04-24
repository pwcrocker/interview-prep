'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Modal } from '@mantine/core';
import { buyTokens, spendTokensReturningUpdatedCount } from '@/lib/tokens';
import { useTokens } from '@/store/TokensContextProvider';

export default function CreditModal({ opened, close }: { opened: boolean; close: () => void }) {
  const { user, isLoading } = useUser();
  const { updateTokens } = useTokens();

  async function obtainCredits() {
    if (!isLoading && user?.sub) {
      const numOfTokens = await buyTokens(user.sub);
      updateTokens(numOfTokens);
    }
  }

  async function subtractCredits() {
    if (!isLoading && user?.sub) {
      const numOfTokens = await spendTokensReturningUpdatedCount(user?.sub, 10);
      updateTokens(numOfTokens);
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Buy Credits" centered>
      <Button loading={isLoading} onClick={obtainCredits}>
        Buy 100 Credits
      </Button>
      <Button loading={isLoading} onClick={subtractCredits}>
        Spend 10 Credits
      </Button>
    </Modal>
  );
}
