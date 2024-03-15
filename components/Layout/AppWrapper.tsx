'use client';

import Link from 'next/link';
import { AppShell, Burger, Button, Center, Flex, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUser } from '@auth0/nextjs-auth0/client';
import classes from './AppWrapper.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import UserDrawer from './UserDrawer';
import DefaultSkeleton from '../Skeletons/DefaultSkeleton';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { user, isLoading } = useUser();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" align="center" style={{ flex: 1 }}>
            <Link href="/">
              <Center>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-tie"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  strokeWidth="0.5"
                  stroke="black"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" fill="#ff6600" />
                  <path
                    d="M12 22l4 -4l-2.5 -11l.993 -2.649a1 1 0 0 0 -.936 -1.351h-3.114a1 1 0 0 0 -.936 1.351l.993 2.649l-2.5 11l4 4z"
                    fill="white"
                  />
                  <path d="M10.5 7h3l5 5.5" />
                </svg>
              </Center>
            </Link>
            <Flex align="center" ml="xl" gap="1rem" visibleFrom="sm">
              <ColorSchemeToggle isLoading={isLoading} />
              <DefaultSkeleton isVisible={isLoading}>
                {user ? (
                  <UserDrawer />
                ) : (
                  <Button
                    variant="default"
                    size="xs"
                    autoContrast
                    className={classes.control}
                    component="a"
                    href="/api/auth/login"
                  >
                    Log In
                  </Button>
                )}
              </DefaultSkeleton>
            </Flex>
            <Flex gap="1rem" justify="center" align="center" hiddenFrom="sm">
              <ColorSchemeToggle isLoading={isLoading} />
              {user ? (
                <UserDrawer />
              ) : (
                <DefaultSkeleton isVisible={isLoading}>
                  <Button
                    variant="default"
                    size="xs"
                    autoContrast
                    className={classes.control}
                    component="a"
                    href="/api/auth/login"
                  >
                    Log In
                  </Button>
                </DefaultSkeleton>
              )}
            </Flex>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control} component="a" href="/">
          Home
        </UnstyledButton>
      </AppShell.Navbar>
      <AppShell.Main>
        <DefaultSkeleton isVisible={isLoading}>{children}</DefaultSkeleton>
      </AppShell.Main>
    </AppShell>
  );
}
