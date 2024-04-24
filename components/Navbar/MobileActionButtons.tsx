'use client';

import { Button } from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import UserDrawer from '../Layout/UserDrawer';
import DefaultSkeleton from '../Skeletons/DefaultSkeleton';

export default function MobileActionButtons() {
  const { user, isLoading } = useUser();
  return (
    <>
      <ColorSchemeToggle />
      {user ? (
        <UserDrawer />
      ) : (
        <DefaultSkeleton isVisible={isLoading}>
          <Button variant="default" size="xs" component="a" href="/api/auth/login">
            Log In
          </Button>
        </DefaultSkeleton>
      )}
    </>
  );
}
