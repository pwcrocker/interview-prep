'use client';

// import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Button, Group } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import UserDrawer from '../Layout/UserDrawer';
// import CreditButton from './CreditButton';
// import { getTokensForUser } from '@/lib/tokens';
// import { log } from '@/lib/logger';
// import { useTokens } from '@/store/TokensContextProvider';

export default function DesktopActionButtons() {
  const { user, isLoading } = useUser();
  // const { updateTokens } = useTokens();

  // useEffect(() => {
  //   async function getAndSetTokens() {
  //     // fetch user's tokens and update tokens
  //     const numOfTokens = await getTokensForUser(user!.sub!);
  //     log(`what is this value: ${numOfTokens}`);
  //     updateTokens(numOfTokens);
  //   }
  //   if (!isLoading && user?.sub) {
  //     getAndSetTokens();
  //   }
  // }, [isLoading]);

  return (
    <Group wrap="nowrap">
      {/* {user && <CreditButton />} */}
      <ColorSchemeToggle />
      {isLoading && <ActionIcon loading={isLoading} variant="default" size={32} />}
      {!isLoading && user && <UserDrawer />}
      {!isLoading && !user && (
        <Button variant="default" size="xs" component="a" href="/api/auth/login">
          Log In
        </Button>
      )}
    </Group>
  );
}
