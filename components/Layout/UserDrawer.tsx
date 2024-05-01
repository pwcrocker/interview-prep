'use client';

import { ActionIcon, Drawer, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import classes from './UserDrawer.module.css';
// import { useTokens } from '@/store/TokensContextProvider';

export default function UserDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading } = useUser();

  return (
    <>
      <ActionIcon variant="default" size={32} onClick={open}>
        <IconUser />
      </ActionIcon>
      <Drawer.Root opened={opened} onClose={close} position="right">
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text size="xl" td="underline">
                Account
              </Text>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            {!isLoading ? (
              <>
                <UnstyledButton className={classes.control} component="a" href="/api/auth/logout">
                  Log Out
                </UnstyledButton>
                <UnstyledButton className={classes.control} component="a" href="/profile/me">
                  Profile
                </UnstyledButton>
              </>
            ) : (
              <UnstyledButton className={classes.control} component="a" href="/api/auth/login">
                Log In
              </UnstyledButton>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
