'use client';

import Link from 'next/link';
import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './AppWrapper.module.css';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link href="/">
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
            </Link>
            <Group ml="xl" gap="1rem" visibleFrom="sm">
              <UnstyledButton className={classes.control} component="a" href="/">
                Home
              </UnstyledButton>
              <UnstyledButton className={classes.control} component="a" href="/onboarding">
                Prep
              </UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton className={classes.control} component="a" href="/">
          Home
        </UnstyledButton>
        <UnstyledButton className={classes.control} component="a" href="/onboarding">
          Prep
        </UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
