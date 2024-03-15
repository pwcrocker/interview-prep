'use client';

import { ActionIcon, Drawer, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import classes from './UserDrawer.module.css';
import DefaultSkeleton from '../Skeletons/DefaultSkeleton';

export default function UserDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const { user, isLoading } = useUser();

  return (
    <>
      <DefaultSkeleton isVisible={isLoading}>
        <ActionIcon variant="default" size={32} onClick={open}>
          <IconUser />
        </ActionIcon>
      </DefaultSkeleton>
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
            {user ? (
              <UnstyledButton className={classes.control} component="a" href="/api/auth/logout">
                Log Out
              </UnstyledButton>
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
