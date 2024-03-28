import { ActionIcon, Button, Group } from '@mantine/core';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import UserDrawer from '../Layout/UserDrawer';

interface DesktopActionButtonProps {
  user: UserProfile | undefined;
  isLoading: boolean;
}

export default function DesktopActionButtons({ user, isLoading }: DesktopActionButtonProps) {
  return (
    <Group wrap="nowrap">
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
