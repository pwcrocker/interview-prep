import { Button } from '@mantine/core';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import UserDrawer from '../Layout/UserDrawer';
import DefaultSkeleton from '../Skeletons/DefaultSkeleton';

interface MobileActionButtonProps {
  user: UserProfile | undefined;
  isLoading: boolean;
}

export default function MobileActionButtons({ user, isLoading }: MobileActionButtonProps) {
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
