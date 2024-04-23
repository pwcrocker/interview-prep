import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Modal } from '@mantine/core';
import { log, logJson } from '@/lib/logger';
import { buyCredits, buyCreditsDb, loseCredits } from '@/lib/credits';
import { touchSession } from '@auth0/nextjs-auth0';

export default function CreditModal({ opened, close }: { opened: boolean; close: () => void }) {
  const { user, isLoading } = useUser();

  async function obtainCredits() {
    // const res = await fetch('http://localhost:3000/api/credits', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ id: user?.sub }),
    // });

    // logJson('Response: ', res);

    if (!isLoading && user?.sub) {
      const result = await buyCreditsDb(user.sub);
      logJson('Front result: ', result);
    }
  }

  async function subtractCredits() {
    if (!isLoading && user?.sub) {
      await loseCredits(user?.sub);
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Buy Credits" centered>
      <Button loading={isLoading} onClick={obtainCredits}>
        Buy 100 Credits
      </Button>
      <Button loading={isLoading} onClick={subtractCredits}>
        Lose 100 Credits
      </Button>
    </Modal>
  );
}
